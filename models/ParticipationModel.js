var mongoose = require('mongoose');

var ParticipationSchema = new mongoose.Schema({
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
    }
});


module.exports = mongoose.model('Participation', ParticipationSchema);