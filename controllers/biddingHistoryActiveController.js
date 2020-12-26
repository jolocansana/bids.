const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");

const activeController = {
    getActive: function(req, res) {
		res.render('bidding-history-active')
	}
}

module.exports = activeController;