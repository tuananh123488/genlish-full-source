const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var NotificationSchema = new mongoose.Schema({
    toUser: {
        _id: String,
        fullName: String,
        avatar: String
    },
    fromUser: {
        _id: String,
        fullName: String,
        avatar: String
    },
    content: String,
    type: String
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('notification', NotificationSchema);