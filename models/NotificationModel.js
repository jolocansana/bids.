var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    listingID: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Notification', NotificationSchema)