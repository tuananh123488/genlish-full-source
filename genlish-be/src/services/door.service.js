'use strict'
const doorModel = require('../models/door.model')

class DoorService {

    createOrUpdate = async (door) => {
        if (door._id) {
            const doorUpdated = await doorModel.findByIdAndUpdate(door._id, door, { new: true })
            return doorUpdated
        } else {
            const doorCreated = await doorModel.create(door)
            return doorCreated
        }
    }

    findByGate = async (gate_id) => {
        console.log(gate_id)
        const doors = await doorModel.find({ 'gate._id': gate_id })
        return doors
    }
}

module.exports = new DoorService()