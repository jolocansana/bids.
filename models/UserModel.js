var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    phonenum: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    college: {
        type: String,
        enum: ['CCS', 'COB', 'SOE', 'BAGCED', 'GCOE', 'COS', 'COL', 'CLA'],
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    idnum: {
        type: Number,
        unique: true,
        required: true
    },
    rating: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    profilePic: {
        type: String,
        required: true,
        default: 'https://coconuts.co/wp-content/uploads/2019/03/archer_4212_032118-960x540.jpg'
    }

});

module.exports = mongoose.model('User', UserSchema);