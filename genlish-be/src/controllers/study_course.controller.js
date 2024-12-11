'use strict'
const studyCourseService = require('../services/study_course.service')
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");

class StudyCourseController {

    create = (req, res) => {
        const data = req.body
        studyCourseService.create(data)
            .then(created => responseWithTokens(req, res, created, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    getByStudentAndCourse = (req, res) => {
        const { studentid, courseid } = req.query
        studyCourseService.getByStudentAndCourse(studentid, courseid)
            .then(founded => responseWithTokens(req, res, founded, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    update = (req, res) => {
        const { id } = req.params
        const data = req.body
        studyCourseService.update(id, data)
            .then(updated => responseWithTokens(req, res, updated, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }

    delete = (req, res) => {
        const { id } = req.params
        studyCourseService.delete(id)
            .then(deleted => responseWithTokens(req, res, deleted, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
}

module.exports = new StudyCourseController()