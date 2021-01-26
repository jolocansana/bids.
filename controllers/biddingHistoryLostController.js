const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");

const lostController = {
    getLost: function(req, res) {
		res.render('bidding-history-lost')
	}
}

module.exports = lostController;