const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");

const homeController = {
	home: function(req,res){
		res.render('home');
	},

	getListings: function(req, res) {
		var query = {};
		var projection = {};

		db.findMany(Listing, query, projection, function(result) {
			console.log("result is: " + result);
			res.send(results);
		});
	}
}

module.exports = homeController;