const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var courseDetailSchema = new mongoose.Schema({
    title: String,
    url: String,
    duration: Number,
    course_id: mongoose.Schema.Types.ObjectId,
    likes: [mongoose.Schema.Types.ObjectId],
    comments: [{
        user: {
            _id: mongoose.Schema.Types.ObjectId,
            fullName: String,
            avatar: String
        },
        time: Date,
        content: String,
        _id: false
    }]
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('CourseDetail', courseDetailSchema);