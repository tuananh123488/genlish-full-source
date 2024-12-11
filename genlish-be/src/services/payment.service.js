'use strict'
const paymentModel = require('../models/payment.model')


class PaymentService {
    insert = async (payment) => {
        try {
            const res = await paymentModel.create(payment)
            return res
        } catch (error) {
            throw new Error(error.message)
        }
    }

    update = async (id, payment) => {
        const updated = await paymentModel.findByIdAndUpdate(id, payment)
        return updated
    }

    getAll = async () => {
        const payments = await paymentModel.find().lean()
        return payments
    }

    getByProviderAndTime = async ({ from, to, provider_id }) => {
        let results = []
        let payments = await paymentModel.find({
            'provider._id': provider_id,
            createdAt: { $gte: from, $lte: to }
        });
        payments.forEach(payment => {
            if (!results.map(item => item.course_id.toString()).includes(payment.course._id)) {
                results.push({ course_id: payment.course._id, course_name: payment.course.name, course_image: payment.course.image, numberOfEpisode: payment.course.numberOfEpisode })
            }
        })
        results = results.map(item => {
            const filter = payments.filter(payment => payment.course._id === item.course_id)
            return { ...item, payments: filter }
        })
        return results;
    }

    getBalance = async (provider_id) => {
        let payments = await paymentModel.find({
            'provider._id': provider_id,
            type: 'STUDENT_TRANFER'
        });
        return payments.reduce((total, item) => total += item.price, 0)
    }

    getWithdrawTeacher = async () => {
        let payments = await paymentModel.find({
            type: 'WAITING_FOR_TEACHER'
        });
        return payments
    }

    withdraw = async (provider_id) => {
        try {
            await paymentModel.updateMany(
                {
                    'provider._id': provider_id,
                    type: 'STUDENT_TRANFER'
                },
                {
                    $set: { type: 'WAITING_FOR_TEACHER' }
                }
            );
            return true
        } catch (error) {
            throw new Error('Rút tiền thất bại')
        }
    }

    completeWithdraw = async (payments) => {
        try {
            await Promise.all(
                payments.map(payment =>
                    paymentModel.findByIdAndUpdate(payment._id, payment)
                )
            );
            return true;
        } catch (error) {
            console.error(error);
            throw new Error('Rút tiền thất bại');
        }
    };

    failWithdraw = async (payments) => {
        try {
            await Promise.all(
                payments.map(payment =>
                    paymentModel.findByIdAndUpdate(payment._id, payment)
                )
            );
            return true;
        } catch (error) {
            console.error(error);
            throw new Error('Thao tác thất bại');
        }
    };

    getByCustomer = async (customer_id) => {
        const payments = paymentModel.find({ 'customer._id': customer_id })
        return payments
    }

    delete = async (id) => {
        const payment = paymentModel.findByIdAndDelete(id)
        return payment
    }
}

module.exports = new PaymentService()