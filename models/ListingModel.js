var mongoose = require('mongoose');

var ListingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    startPrice: {
        type: Number,
        required: true
    },
    buyOutPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: false
    },
    startDate: { // Validation?
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    highestBidder: {
        type: String,
        required: false
    },
    highestBid: {
        type: Number,
        required: false
    },
    listingOwner: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        enum: ['clothes', 'food', 'electronics', 'tickets', 
                'furniture', 'beauty', 'books', 'hobbies',
                'sports', 'accessories', 'media', 'music', 'pets'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    }
});

module.exports = mongoose.model('Listing', ListingSchema);