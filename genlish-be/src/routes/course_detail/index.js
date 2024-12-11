'use strict'

const express = require('express')
const router = express.Router()
const courseDetailController = require('../../controllers/course_detail.controller')
const middleware = require('../../controllers/middleware')

router.post('/create', middleware.checkToken, courseDetailController.create)
router.put('/update/:id', middleware.checkToken, courseDetailController.update)
router.get('/get-by-course/:id', middleware.checkToken, courseDetailController.getByCourse)
router.delete('/delete/:id', middleware.checkToken, courseDetailController.delete)

module.exports = router  