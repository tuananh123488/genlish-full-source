'use strict'

const express = require('express')
const router = express.Router()

router.use('/api/v1/auth', require('./auth'))
router.use('/api/v1/gate', require('./gate'))
router.use('/api/v1/door', require('./door'))
router.use('/api/v1/openai', require('./openai'))
router.use('/api/v1/user', require('./user'))
router.use('/api/v1/broadcast', require('./broadcast'))
router.use('/api/v1/vocabulary', require('./vocabulary'))
router.use('/api/v1/comment', require('./comment'))
router.use('/api/v1/course', require('./course'))
router.use('/api/v1/coursedetail', require('./course_detail'))
router.use('/api/v1/studycourse', require('./study_course'))
router.use('/api/v1/payment', require('./payment'))
router.use('/api/v1/notification', require('./notification'))
module.exports = router