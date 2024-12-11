'use strict'
const courseDetailService = require('../services/course_detail.service')
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");

class CourseController {

    create = (req, res) => {
        const course = req.body
        courseDetailService.create(course)
            .then(created => responseWithTokens(req, res, created, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
    getByCourse = (req, res) => {
        const { id } = req.params
        courseDetailService.getByCourse(id)
            .then(courses => responseWithTokens(req, res, courses, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
    delete = (req, res) => {
        const { id } = req.params
        courseDetailService.delete(id)
            .then(deleted => responseWithTokens(req, res, deleted, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
    updateLikesField = (req, res) => {
        courseDetailService.updateLikesField()
    }

    update = (req, res) => {
        const { id } = req.params
        const data = req.body
        courseDetailService.update(id, data)
            .then(updated => responseWithTokens(req, res, updated, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
}

module.exports = new CourseController()