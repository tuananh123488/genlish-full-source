'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../../controllers/middleware')
const userController = require('../../controllers/user.controller')

router.post('/update', middleware.checkToken, userController.update)
router.get('/get-all-student', middleware.checkToken, userController.getAllStudent)
router.get('/get-all-teacher', middleware.checkToken, userController.getAllTeacher)
router.post('/updatePassword', middleware.checkToken, userController.updatePassWord)
router.get('/getByPhone/:phone', userController.getByPhone)
router.get('/getById/:id', userController.getById)
router.post('/changeNewPassword', userController.changeNewPassword)
router.delete('/delete/:id', middleware.checkToken, userController.delete)

module.exports = router  