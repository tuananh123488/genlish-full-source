'use strict'

const express = require('express')

const router = express.Router()
const commentController = require('../../controllers/comment.controller')

router.post('/save', commentController.insert)
router.get('/get-all', commentController.getAll)
module.exports = router  