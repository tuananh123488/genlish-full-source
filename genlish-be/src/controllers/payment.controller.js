'use strict'

const { responseWithNoTokens, responseWithTokens } = require("../utils/response");
const paymentService = require('../services/payment.service')
class PaymentController {
    getAll = (req, res) => {
        paymentService.getAll()
            .then(payments => responseWithTokens(req, res, payments, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
    insert = (req, res) => {
        paymentService.insert(req.body)
            .then(created => responseWithTokens(req, res, created, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    getByProviderAndTime = (req, res) => {
        const { from, to, provider_id } = req.body
        paymentService.getByProviderAndTime({ provider_id, from, to })
            .then(payments => responseWithTokens(req, res, payments, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    getBalance = (req, res) => {
        const { provider_id } = req.params
        paymentService.getBalance(provider_id)
            .then(balance => responseWithTokens(req, res, balance, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    payment = async (req, res) => {
        const data = req.body
        const startUser = data.content.indexOf("MaKH") + 4;
        const endUser = data.content.indexOf("MaCourse", startUser);
        const user_id = data.content.substring(startUser, endUser);
        const startCourse = data.content.indexOf("MaCourse") + 8;
        const endCourse = data.content.indexOf("THANHTOAN", startCourse);
        const course_id = data.content.substring(startCourse, endCourse);

        const payment = {
            course: {
                _id: course_id
            },
            customer: {
                _id: user_id
            },
            paymentInfo: data.content
        }
        await paymentService.insert(payment)
        return true
    }

    withdraw = async (req, res) => {
        const { provider_id } = req.params
        paymentService.withdraw(provider_id)
            .then(result => responseWithTokens(req, res, result, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    checkPayment = async (req, res) => {
        const { user_id, course_id } = req.body
        const payments = await paymentService.getAll()
        const filter = payments.filter(item => {
            return item.course._id.toString() === course_id.toString() && item.customer._id.toString() === user_id.toString()
        })[0]
        if (filter) {
            return responseWithNoTokens(req, res, filter, 200)
        }
        return responseWithNoTokens(req, res, null, 200)
    }

    getWithdrawTeacher = async (req, res) => {
        paymentService.getWithdrawTeacher()
            .then(result => responseWithTokens(req, res, result, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    completeWithdraw = async (req, res) => {
        const payments = req.body
        paymentService.completeWithdraw(payments)
            .then(result => responseWithTokens(req, res, result, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    failWithdraw = async (req, res) => {
        const payments = req.body
        paymentService.failWithdraw(payments)
            .then(result => responseWithTokens(req, res, result, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    update = (req, res) => {
        const { id, payment } = req.body
        paymentService.update(id, payment)
            .then(updated => responseWithTokens(req, res, updated, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    getByCustomer = (req, res) => {
        const { id } = req.params
        paymentService.getByCustomer(id)
            .then(payments => responseWithTokens(req, res, payments, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    delete = (req, res) => {
        const { id } = req.params
        paymentService.delete(id)
            .then(deleted => responseWithNoTokens(req, res, deleted, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

}

module.exports = new PaymentController()