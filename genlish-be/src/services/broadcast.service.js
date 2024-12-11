'use strict'
const broadcastModel = require('../models/broadcast.model')
const { handleSRTFile } = require('../utils/file')

class BroadCastService {

    getAll = async () => {
        return await broadcastModel.find()
    }

    insert = async (englishSrtFile, vietnameseSrtFile, urlVideo, title, duration, channelName, thum) => {
        try {
            if (!vietnameseSrtFile || !englishSrtFile) {
                throw new Error('No file provided')
            }
            // const broadcastsURL = await broadcastModel.find().map(item => item.urlVideo)
            const broadcastsURL = await broadcastModel.find()
            if (broadcastsURL.includes(urlVideo)) {
                throw new Error('Broadcast already exists in the system')
            }
            const srtContentVI = vietnameseSrtFile.buffer.toString('utf-8');
            const srtContentEN = englishSrtFile.buffer.toString('utf-8');
            const vietnameseSubtitle = handleSRTFile(srtContentVI)
            const englishSubtitle = handleSRTFile(srtContentEN)
            console.log(englishSubtitle);

            const broadcast = { vietnameseSubtitle, englishSubtitle, urlVideo, title, channelName, thum, duration }
            const res = await broadcastModel.create(broadcast)
            return res
        } catch (error) {
            throw new Error(error.message)
        }
    }
    delete = async (broadCastId) => {
        const broadcasts = await broadcastModel.findByIdAndDelete(broadCastId)
        return broadcasts
    }

}

module.exports = new BroadCastService()