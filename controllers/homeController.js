const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");

const homeController = {
	home: function(req,res){
		var query = {status: "active"};
		var projection = {};

		db.findMany(Listing, query, projection, function(results) {

			res.render('home', {
				listings:results
			});
		});
	},
	getListings: function(req, res) {
		
	},
	getAbout: function(req,res) {
		res.render('about', {});
	}
}

module.exports = homeController;