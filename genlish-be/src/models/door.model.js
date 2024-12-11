const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var doorSchema = new mongoose.Schema({
    gate: {
        _id: mongoose.Types.ObjectId,
        title: String,
        level: Number
    },
    individual: {
        title: String,
        image: String,
        numberOfTest: Number,
        color: String,
        door: Number
    },
    beginner: [String],
    elementary: [String],
    intermediate: [String],
    upperIntermediate: [String],
    advanced: [String],
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Door', doorSchema);