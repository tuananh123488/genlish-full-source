'use strict'

const express = require('express')
const router = express.Router()

const vocabularyController = require('../../controllers/vocabulary.controller')

router.get('/search/:word', vocabularyController.search)

module.exports = router  