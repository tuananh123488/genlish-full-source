'use strict'

const express = require('express')
const upload = require('../../upload/upload')
const middleware = require('../../controllers/middleware')
const router = express.Router()
const broadCastController = require('../../controllers/broadcast.controller')

router.post('/save', upload.array('strs'), broadCastController.insert)
router.get('/get-all', broadCastController.getAll)
router.delete('/delete/:broadCastId', broadCastController.delete)
module.exports = router  