var mongoose = require('mongoose');

var PinnedSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    listingId: {
        type: String,
        required: true
    },
    pinStatus: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    }
});


module.exports = mongoose.model('Pinned', PinnedSchema);