'use strict'

const express = require('express')
const router = express.Router()
const studyCourseController = require('../../controllers/study_course.controller')
const middleware = require('../../controllers/middleware')

router.post('/create', middleware.checkToken, studyCourseController.create)
router.get('/get-by-student-and-course', middleware.checkToken, studyCourseController.getByStudentAndCourse)
router.delete('/delete/:id', middleware.checkToken, studyCourseController.delete)
router.put('/update/:id', middleware.checkToken, studyCourseController.update)
module.exports = router  