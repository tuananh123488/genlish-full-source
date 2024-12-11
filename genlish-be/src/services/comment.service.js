'use strict'
const commentModel = require('../models/comment.model')


class CommentService {

    getAll = async () => {
        return await commentModel.find()
    }

    insert = async (comment) => {
        try {
            const res = await commentModel.create(comment)
            return res
        } catch (error) {
            throw new Error(error.message)
        }
    }

}

module.exports = new CommentService()