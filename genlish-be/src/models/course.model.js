const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var courseSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    teacher: {
        _id: mongoose.Schema.Types.ObjectId,
        fullName: String,
        avatar: String
    },
    description: String,
    slug: String,
    result: String,
    level: String,
    type: String,
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Course', courseSchema);