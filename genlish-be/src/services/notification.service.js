'use strict'
const notificationModel = require('../models/notification.model')

class NotifycationService {

    getAll = async () => {
        return await notificationModel.find()
    }

    insert = async (notification) => {
        try {
            const res = await notificationModel.create(notification)
            return res
        } catch (error) {
            throw new Error(error.message)
        }
    }

}

module.exports = new NotifycationService()