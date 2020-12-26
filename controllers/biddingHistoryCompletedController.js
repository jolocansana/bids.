const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");

const completedController = {
    getCompleted: function(req, res) {
		res.render('bidding-history-completed')
	}
}

module.exports = completedController;