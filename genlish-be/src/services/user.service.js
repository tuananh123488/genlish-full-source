'use strict'

const userModel = require("../models/user.model")
const authUtils = require("../utils/auth")
const jwt = require('jsonwebtoken');
const { sendMail, generateRandomNumber } = require("../utils/mailer");
const bcrypt = require('bcryptjs');
const courseService = require('../services/course.service')
class UserService {
    getByID = async (id) => {
        const user = await userModel.findById(id)
        return user
    }

    delete = async (id) => {
        const user = await userModel.findByIdAndDelete(id)
        return user
    }

    changeNewPassword = async (phone, newPassword, reNewPassword) => {
        try {

            if (!newPassword || !reNewPassword) {
                throw new Error('Không được để trống');
            }
            if (newPassword !== reNewPassword) {
                throw new Error('Mật khẩu mới và mật khẩu xác nhận không khớp');
            }
            const user = await userModel.findOne({ phone: phone });
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
            user.password = await bcrypt.hash(newPassword, 10);
            const userUpdated = await user.save();
            return { success: true, user: userUpdated };
        } catch (e) {
            throw new Error(e.message);
        }

    }
    getByPhone = async (phone) => {
        try {

            if (phone === "undefined") {
                throw new Error('Vui lòng nhập số điện thoại');
            }
            const user = await userModel.findOne({ phone: phone });
            if (!user) {

                throw new Error('Không tìm thấy người dùng với số điện thoại này');
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    };
    update = async (user) => {
        const userUpdated = await userModel.findByIdAndUpdate(user._id, user, { new: true })
        return userUpdated
    }
    getAllStudent = async () => {
        const users = await userModel.find({ role: 'USER' })
        return users
    }
    getAllTeacher = async () => {
        let users = await userModel.find({ role: 'TEACHER' }).lean()
        const courses = await courseService.getAll()
        users = users.map(user => {
            const filter = courses.filter(item => {
                return item.teacher._id.toString() === user._id.toString()
            })
            return { ...user, courses: filter }
        })
        return users
    }
    updatePassword = async (id, oldPassword, newPassword) => {
        try {
            const findByUser = await userModel.findById(id);
            if (!findByUser) {
                throw new Error('Người dùng không tồn tại');
            }


            const isValidPassword = await bcrypt.compare(oldPassword, findByUser.password);
            if (!isValidPassword) {
                throw new Error('Mật khẩu cũ không chính xác');
            }


            findByUser.password = await bcrypt.hash(newPassword, 10);
            const userUpdated = await findByUser.save();

            return { success: true, user: userUpdated };
        } catch (e) {
            throw new Error(e.message);
        }

    }
}

module.exports = new UserService()