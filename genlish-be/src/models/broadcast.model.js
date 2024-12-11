const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var broadCastSchema = new mongoose.Schema({
    title: String,
    urlVideo: String,
    englishSubtitle: [
        {
            id: Number,
            firstTime: Number,
            lastTime: Number,
            content: String
        }
    ],
    vietnameseSubtitle: [
        {
            id: Number,
            firstTime: Number,
            lastTime: Number,
            content: String
        }
    ],
    channelName: String,
    thum: String,
    duration: String
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('broadcast', broadCastSchema);