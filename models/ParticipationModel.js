var mongoose = require('mongoose');
const User = require('./UserModel');

var ParticipationSchema = new mongoose.Schema({
    user: {
        type: Object,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    listingId: {
        type: String,
        required: true
    },
    bid: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    }
});


module.exports = mongoose.model('Participation', ParticipationSchema);