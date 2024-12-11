'use strict'
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");
const openAIService = require('../services/openai.service')

class OpenAIController {

    ask = (req, res) => {
        const { ask } = req.body
        openAIService.ask(ask)
            .then(result => responseWithNoTokens(req, res, result, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
}

module.exports = new OpenAIController()