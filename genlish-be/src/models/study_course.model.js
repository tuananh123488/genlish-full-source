const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var StudyCourseSchema = new mongoose.Schema({
    student_id: mongoose.Schema.Types.ObjectId,
    course_id: mongoose.Schema.Types.ObjectId,
    currentTimeStudied: {
        type: Number,
        default: 0
    },
    process: Number,
    complete: {
        type: Boolean,
        default: false
    },
    note: {
        type: String,
        default: ''
    },
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('StudyCourse', StudyCourseSchema);