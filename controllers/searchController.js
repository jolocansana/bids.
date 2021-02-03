const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");

const searchController = {
	getSearch: function(req,res){
        var query = {}
        if (req.query.key){
            query = { name: req.query.key }
        }
        if (req.query.filter) {
            query = { productType: req.query.filter }
        }
        var projection = {};

		db.findMany(Listing, query, projection, function(results) {

            var active = results.filter(function(r) {
                return r.status == 'active'
            })
            var closed = results.filter(function(r) {
                return r.status == 'inactive'
            })

            res.render('search-results', {
                category: req.query.filter,
                active:active,
                closed:closed,
            });
        });
    },
}

module.exports = searchController;