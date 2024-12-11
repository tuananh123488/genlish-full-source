const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var paymentSchema = new mongoose.Schema({
    course: {
        _id: mongoose.Schema.Types.ObjectId,
        image: String,
        name: String,
        numberOfEpisode: Number
    },
    price: Number,
    customer: {
        _id: mongoose.Schema.Types.ObjectId,
        fullName: String,
        avatar: String
    },
    provider: {
        _id: mongoose.Schema.Types.ObjectId,
        fullName: String,
        avatar: String
    },
    paymentInfo: String,
    type: String
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Payment', paymentSchema);