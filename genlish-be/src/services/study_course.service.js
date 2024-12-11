'use strict'
const studyCourseModel = require('../models/study_course.model')
const { removeVietnameseTones } = require('../utils/text')

class courseService {

    create = async (data) => {
        const data1 = await studyCourseModel.find().lean()
        const filter = data1.filter(item => item.student_id.toString() === data.student_id.toString() && item.course_id.toString() === data.course_id.toString())[0]
        if (filter) {
            throw new Error('hồ sơ đăng ký khóa học này đã tồn tại')
        } else {
            const created = await studyCourseModel.create(data)
            return created
        }
    }

    getByStudentAndCourse = async (studentid, courseid) => {
        const founded = await studyCourseModel.findOne({ student_id: studentid, course_id: courseid })
        return founded
    }

    update = async (id, data) => {
        const updated = await studyCourseModel.findByIdAndUpdate(id, data, { new: true });
        console.log(updated)
        return updated;
    }

    delete = async (id) => {
        const deleted = await studyCourseModel.findByIdAndDelete(id)
        return deleted
    }

}

module.exports = new courseService()