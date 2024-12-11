'use strict'
const vocabulary = require("../services/vocabulary.service");
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");
class VocabularyController {

    search = (req, res) => {
        const { word } = req.params
        vocabulary.search(word)
            .then(result => responseWithNoTokens(req, res, result, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
}

module.exports = new VocabularyController()