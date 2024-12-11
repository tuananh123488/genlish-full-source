'use strict'

const { responseWithNoTokens, responseWithTokens } = require("../utils/response");
const commentService = require('../services/comment.service')
class CommentController {

    insert = (req, res) => {

        commentService.insert(req.body)
            .then(comment => responseWithNoTokens(req, res, comment, 201))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    getAll = (req, res) => {
        commentService.getAll()
            .then(comment => responseWithNoTokens(req, res, comment, 201))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
}

module.exports = new CommentController()