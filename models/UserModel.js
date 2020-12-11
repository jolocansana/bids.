var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
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
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
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