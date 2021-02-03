const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");

const searchController = {
	getSearch: function(req,res){
        var searchKey = req.query.key;
        var filter = req.query.filter;
        var query = {};
        var projection = {};
        console.log(searchKey, filter);

		// db.findMany(Listing, query, projection, function(results) {

		// 	res.render('home', {
		// 		listings:results
		// 	});
		// });
	},
}

module.exports = searchController;