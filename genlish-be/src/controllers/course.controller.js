'use strict'
const courseService = require('../services/course.service')
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");

class CourseController {

    create = (req, res) => {
        const course = req.body
        courseService.create(course)
            .then(created => responseWithTokens(req, res, created, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
    update = (req, res) => {
        const course = req.body
        courseService.update(course)
            .then(updated => responseWithTokens(req, res, updated, 201))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
    getAll = (req, res) => {
        courseService.getAll()
            .then(courses => responseWithNoTokens(req, res, courses, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
    getBySlug = (req, res) => {
        const { slug } = req.params
        courseService.getBySlug(slug)
            .then(course => responseWithNoTokens(req, res, course, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
    delete = (req, res) => {
        const { id } = req.params
        courseService.delete(id)
            .then(deleted => responseWithTokens(req, res, deleted, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
    getByTeacher = (req, res) => {
        const { id } = req.params
        courseService.getByTeacher(id)
            .then(courses => responseWithTokens(req, res, courses, 200))
            .catch(error => responseWithTokens(req, res, error.message, 500))
    }
}

module.exports = new CourseController()