'use strict'
const doorService = require('../services/door.service')
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");

class DoorController {

    createOrUpdate = (req, res) => {
        const door = req.body
        doorService.createOrUpdate(door)
            .then(door => responseWithNoTokens(req, res, door, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    findByGate = (req, res) => {
        const { id } = req.params
        doorService.findByGate(id)
            .then(doors => responseWithNoTokens(req, res, doors, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
}

module.exports = new DoorController()