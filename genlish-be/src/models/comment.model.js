const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CommentSchema = new mongoose.Schema({
    user: {
        _id: String,
        fullName: String,
        avatar: String
    },
    content: String,
    video_id: String
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('comment', CommentSchema);