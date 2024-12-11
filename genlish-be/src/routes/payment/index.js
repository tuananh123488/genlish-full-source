'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../../controllers/middleware')
const paymentController = require('../../controllers/payment.controller')
const paymentService = require('../../services/payment.service')

router.post('/insert', middleware.checkToken, paymentController.insert)
router.post('/get-by-time-and-provider', middleware.checkToken, paymentController.getByProviderAndTime)
router.get('/get-balance/:provider_id', middleware.checkToken, paymentController.getBalance)
router.put('/withdraw/:provider_id', middleware.checkToken, paymentController.withdraw)
router.post('/create_payment_url', paymentController.payment)
router.post('/check_payment', paymentController.checkPayment)
router.post('/update', middleware.checkToken, paymentController.update)
router.get('/get-by-customer/:id', middleware.checkToken, paymentController.getByCustomer)
router.get('/get-withdraw-teacher', middleware.checkToken, paymentController.getWithdrawTeacher)
router.delete('/delete/:id', paymentController.delete)
router.post('/complete-withdraw', middleware.checkToken, paymentController.completeWithdraw)
router.post('/fail-withdraw', middleware.checkToken, paymentController.failWithdraw)
router.get('/get-all', middleware.checkToken, paymentController.getAll)
module.exports = router