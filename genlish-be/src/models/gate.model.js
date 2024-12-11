const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var gateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    level: Number
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Gate', gateSchema);