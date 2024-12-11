// !mdbgum

const mongoose = require('mongoose'); // Erase if already required
const moment = require('moment-timezone');

// Thiết lập múi giờ mặc định là 'Asia/Ho_Chi_Minh'
moment.tz.setDefault('Asia/Ho_Chi_Minh');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    fullName: {
        type: String,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: Boolean,
        require: true
    },
    address: {
        type: String,
    },
    email: {
        type: String,
    },
    avatar: {
        type: String,
        default: 'https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0'
    },
    statusSignUp: {
        type: Number,
        default: 0
    },
    individual: {
        reasonToLearnEnglish: [String],
        currentEnglishLevel: String,
        englishLearningTimeInOneDay: String
    },
    study: {
        levelVocabulary: {
            door: {
                type: Number,
                default: 1
            },
            gate: {
                type: Number,
                default: 1
            },
            level: {
                type: Number,
                default: 1
            }
        }
    },
    role: {
        type: String,
        default: 'USER'
    },
    bank: {
        accountName: String,
        accountNumber: String,
        bankName: String
    },
    statusTeacher: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('User', userSchema);
