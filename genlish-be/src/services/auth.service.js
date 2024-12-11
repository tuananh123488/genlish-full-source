'use strict'

const userModel = require("../models/user.model")
const bcrypt = require('bcryptjs');
const authUtils = require("../utils/auth")
const jwt = require('jsonwebtoken');
const { sendMail, generateRandomNumber } = require("../utils/mailer");
let QUEUE_VERIFICATIONS = []

class AuthService {

    signUpStep1 = async (phone, password) => {
        const user = await userModel.findOne({ phone })
        if (user)
            throw new Error('Số điện thoại đã tồn tại trong hệ thống')
        else {
            const passwordEncode = await authUtils.hashPassword(password)
            const userResult = await userModel.create({ phone, password: passwordEncode, statusSignUp: 1 })
            userResult.password = ''
            return userResult
        }
    }

    signUpStepOther = async (user) => {
        const userFound = await userModel.findOne({ phone: user.phone })
        const userUpdated = await userModel.findByIdAndUpdate(user._id, { ...user, password: userFound.password }, { new: true })
        return userUpdated
    }

    signIn = async (phone, pass) => {
        try {
            const user = await userModel.findOne({ phone })
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
            const isMatch = await bcrypt.compare(pass, user.password);
            user.password = ''
            if (isMatch && user.role === 'USER') {
                return {
                    user,
                    tokens: await this.generateTokens({ user_id: user._id })
                }
            }
            throw new Error('Thông tin đăng nhập không trùng khớp');
        } catch (e) {
            throw new Error(e.message);
        }
    }

    generateTokens = async (user, expire) => {
        const accessToken = jwt.sign(user, process.env.SECRETKEY, { expiresIn: process.env.ACCESSEXPIRES });
        const refreshToken = jwt.sign(user, process.env.SECRETKEY, { expiresIn: expire ? expire : process.env.REFRESHEXPIRES });
        return {
            accessToken,
            refreshToken
        }
    }

    signInWithTeacher = async (phone, pass) => {
        try {
            const user = await userModel.findOne({ phone }).lean()
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
            const isMatch = await bcrypt.compare(pass, user.password);
            user.password = ''
            if (isMatch && user.role === 'TEACHER') {
                return {
                    user,
                    tokens: await this.generateTokens({ user_id: user._id })
                }
            }
            throw new Error('Thông tin đăng nhập không trùng khớp');
        } catch (e) {
            throw new Error(e.message);
        }
    }

    signInWithAdmin = async (phone, pass) => {
        try {
            const user = await userModel.findOne({ phone }).lean()
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
            const isMatch = await bcrypt.compare(pass, user.password);
            user.password = ''
            if (isMatch && user.role === 'ADMIN') {
                return {
                    user,
                    tokens: await this.generateTokens({ user_id: user._id })
                }
            }
            throw new Error('Thông tin đăng nhập không trùng khớp');
        } catch (e) {
            throw new Error(e.message);
        }
    }

    signUpWithTeacher = async (user) => {
        const founded = await userModel.findOne({ 'phone': user.phone })
        console.log(founded)
        if (founded)
            throw new Error('Số điện thoại đã tồn tại trong hệ thống')
        else {
            const passwordEncode = await authUtils.hashPassword(user.password)
            const userResult = await userModel.create({ ...user, password: passwordEncode })
            userResult.password = ''
            return userResult
        }
    }
}

module.exports = new AuthService()