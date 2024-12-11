'use strict'

const express = require('express')
const router = express.Router()
const courseController = require('../../controllers/course.controller')
const middleware = require('../../controllers/middleware')

router.post('/create', middleware.checkToken, courseController.create)
router.get('/get-all', courseController.getAll)
router.get('/get-by-slug/:slug', courseController.getBySlug)
router.get('/get-by-teacher/:id', middleware.checkToken, courseController.getByTeacher)
router.delete('/delete/:id', middleware.checkToken, courseController.delete)
router.post('/update', middleware.checkToken, courseController.update)

module.exports = router  