'use strict'
const courseModel = require('../models/course.model')
const courseDetailService = require('../services/course_detail.service')
const { removeVietnameseTones } = require('../utils/text')

class courseService {

    create = async (course) => {
        const created = await courseModel.create(course)
        return created
    }

    getAll = async () => {
        let courses = await courseModel.find().lean()
        const items = await courseDetailService.getAll()
        courses = courses.map(item => {
            const results = items.filter(item1 => item1.course_id.toString() === item._id.toString())
            return { ...item, list_course: results }
        })
        return courses
    }

    getBySlug = async (slug) => {
        let courses = await courseModel.find().lean()
        const items = await courseDetailService.getAll()
        let course = courses.filter(item => removeVietnameseTones(item.slug) === slug)[0]
        course = { ...course, list_course: items.filter(item => item.course_id.toString() === course._id.toString()) }
        return course
    }

    delete = async (id) => {
        const deleted = await courseModel.findByIdAndDelete(id)
        await courseDetailService.deleteByCourse(id)
        return deleted
    }

    getByTeacher = async (id) => {
        const courses = await courseModel.find({ 'teacher._id': id }).lean()
        return courses
    }

    update = async (course) => {
        const updated = await courseModel.findByIdAndUpdate(course._id, course, { new: true })
        return updated
    }

}

module.exports = new courseService()