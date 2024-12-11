'use strict'

const { responseWithNoTokens, responseWithTokens } = require("../utils/response");
const notificationService = require('../services/notification.service')
class NotificationController {

    insert = (req, res) => {

        notificationService.insert(req.body)
            .then(notification => responseWithNoTokens(req, res, notification, 201))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    getAll = (req, res) => {
        notificationService.getAll()
            .then(notification => responseWithNoTokens(req, res, notification, 201))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
}

module.exports = new NotificationController()