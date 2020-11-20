const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");

const homeController = {
	home: function(req,res){
		var query = {};
		var projection = {};

		

		db.findMany(Listing, null, projection, function(results) {
			console.log("result is: " + results);
			res.render('home', {
				listings:results
			});
		});
	},

	getListings: function(req, res) {
		
	}
}

module.exports = homeController;