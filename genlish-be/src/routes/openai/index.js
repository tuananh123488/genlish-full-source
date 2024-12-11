'use strict'

const express = require('express')
const router = express.Router()
const openAIController = require('../../controllers/openai.controller')

router.post('/ask', openAIController.ask)

module.exports = router  