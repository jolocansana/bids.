const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
const fuzzysort = require('fuzzysort')

const searchController = {
	getSearch: function(req,res){
        var query = {}

		db.findMany(Listing, query, {}, function(results) {

            if (req.query.key) {
                const options = {
                    limit: 100, // don't return more results than you need!
                    allowTypo: true, // if you don't care about allowing typos
                    threshold: -1000, // don't return bad results
                    keys: ['name', 'tags']
                  }
                const sorted = fuzzysort.go(req.query.key, results, options )
                var active = sorted.filter(function(r) {
                    return r.obj.status == 'active'
                })
                var closed = sorted.filter(function(r) {
                    return r.obj.status == 'inactive'
                })
                console.log((active.length > 0 || closed.length > 0))
                
                res.render('search-results', {
                    category: null,
                    active: active,
                    closed: closed,
                    search: req.query.key,
                    found: (active.length > 0 || closed.length > 0),
                });
            }
                
        });
    },
    getFilter: function(req, res) {
        var query = { productType: req.query.filter }

        db.findMany(Listing, query, {}, function(results) {
            var active = results.filter(function(r) {
                return r.status == 'active'
            })
            var closed = results.filter(function(r) {
                return r.status == 'inactive'
            })

            res.render('filter-results', {
                category: req.query.filter,
                search: false,
                active: active,
                closed: closed,
                found: (results.length > 0)
            })
        })

    }, 
}

module.exports = searchController;