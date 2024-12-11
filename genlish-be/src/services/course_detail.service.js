'use strict'
const courseDetailModel = require('../models/course_detail.model')

class courseService {

    create = async (course) => {
        const created = await courseDetailModel.create(course)
        return created
    }

    getByCourse = async (id) => {
        const courses = await courseDetailModel.find({ course_id: id })
        return courses
    }

    getAll = async (id) => {
        const courses = await courseDetailModel.find().lean()
        return courses
    }

    delete = async (id) => {
        const deleted = await courseDetailModel.findByIdAndDelete(id)
        return deleted
    }

    deleteByCourse = async (id) => {
        const r = await courseDetailModel.deleteMany({ course_id: id })
        return r
    }

    update = async (id, data) => {
        const updated = await courseDetailModel.findByIdAndUpdate(id, data, { new: true })
        return updated
    }

    updateLikesField = async () => {
        console.log("Starting update...");
        const result = await courseDetailModel.updateMany(
            { comments: { $exists: false } },
            { $set: { comments: [] } }
        );
        console.log("Update completed:", result);
    };


}

module.exports = new courseService()