'use strict'

const express = require('express')

const router = express.Router()
const notificationController = require('../../controllers/notification.controller')

router.post('/save', notificationController.insert)
router.get('/get-all', notificationController.getAll)
module.exports = router  