var mongoose = require('mongoose');

var ParticipationSchema = new mongoose.Schema({
    archerUsername: {
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
    }
});


module.exports = mongoose.model('Participation', ParticipationSchema);