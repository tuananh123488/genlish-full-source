'use strict'

const authService = require("../services/auth.service");
const userService = require('../services/user.service')
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");

class AuthController {

    signUpWithTeacher = (req, res) => {
        const user = req.body
        authService.signUpWithTeacher(user)
            .then(created => responseWithNoTokens(req, res, created, 200))
            .catch(error => {
                console.log(error)
                return responseWithNoTokens(req, res, error.message, 500)
            })
    }

    signInWithTeacher = (req, res) => {
        const { phone, password } = req.body
        authService.signInWithTeacher(phone, password)
            .then(user => responseWithNoTokens(req, res, user, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    signInWithAdmin = (req, res) => {
        const { phone, password } = req.body
        authService.signInWithAdmin(phone, password)
            .then(user => responseWithNoTokens(req, res, user, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    signIn = (req, res) => {
        const { phone, password } = req.body
        authService.signIn(phone, password)
            .then(user => responseWithNoTokens(req, res, user, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    signUpStep1 = (req, res) => {
        const { phone, password } = req.body
        authService.signUpStep1(phone, password)
            .then(userCreated => responseWithNoTokens(req, res, userCreated, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    signUpStepOther = (req, res) => {
        const user = req.body
        authService.signUpStepOther(user)
            .then(userUpdate => responseWithNoTokens(req, res, userUpdate, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    generateToken = (req, res) => {
        const { id } = req.body
        authService.generateTokens({ user_id: id })
            .then(tokens => responseWithNoTokens(req, res, tokens, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    findUserByToken = async (req, res) => {
        const user = await userService.getByID(req.userid)
        return responseWithTokens(req, res, user, 200)
    }
}

module.exports = new AuthController()