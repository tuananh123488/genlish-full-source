'use strict'

const express = require('express')
const router = express.Router()
const doorController = require('../../controllers/door.controller')

router.post('/save-or-update', doorController.createOrUpdate)
router.get('/get-by-gate/:id', doorController.findByGate)

module.exports = router  