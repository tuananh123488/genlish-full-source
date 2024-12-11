'use strict'

const { responseWithNoTokens, responseWithTokens } = require("../utils/response");
const broadCastService = require('../services/broadcast.service')
class BroadCastController {

    insert = (req, res) => {
        const { urlVideo, title, channelName, thum, duration } = req.body
        const srts = req.files
        const englishSrtFile = srts[0]
        const vietnameseSrtFile = srts[1]


        broadCastService.insert(englishSrtFile, vietnameseSrtFile, urlVideo, title, duration, channelName, thum)
            .then(broadcast => responseWithNoTokens(req, res, broadcast, 201))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    getAll = (req, res) => {
        broadCastService.getAll()
            .then(broadcasts => responseWithNoTokens(req, res, broadcasts, 201))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
    delete = (req, res) => {
        const { broadCastId } = req.params


        broadCastService.delete(broadCastId)
            .then(broadcasts => responseWithNoTokens(req, res, broadcasts, 201))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
}

module.exports = new BroadCastController()