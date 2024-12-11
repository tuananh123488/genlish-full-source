'use strict'
const gateService = require('../services/gate.service')
const { responseWithNoTokens, responseWithTokens } = require("../utils/response");

class GateController {

    create = (req, res) => {
        const { title, level } = req.body
        gateService.create({ title, level })
            .then(gate => responseWithNoTokens(req, res, gate, 201))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }

    getAll = (req, res) => {
        gateService.getAll()
            .then(gates => responseWithNoTokens(req, res, gates, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
    delete = (req, res) => {
        const { gateId } = req.params
        console.log(gateId);

        gateService.delete(gateId)
            .then(gates => responseWithNoTokens(req, res, gates, 200))
            .catch(error => responseWithNoTokens(req, res, error.message, 500))
    }
}

module.exports = new GateController()