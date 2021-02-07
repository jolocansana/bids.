const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
const Participation = require("../models/ParticipationModel.js");

const activeController = {
    getActive: function(req, res) {
        var userID = req.session._id
			
        db.findMany(Listing, {listingOwner:userID, status:'active'}, null, function(results) {
            var listings = []
            for (var i=0; i<results.length ; i++){ 
                var image = results[i].images[0]
                var name = results[i].name
                var highestBid = results[i].highestBid
                var highestBidder = results[i].highestBidder
                var endDate = results[i].endDate
                var _id = results[i]._id
                var listing = {
                    image: image,
                    name: name,
                    highestBid:highestBid,
                    highestBidder:highestBidder,
                    endDate:endDate,
                    _id:_id
                }
                listings.push(listing)
            }
            listings.sort((a,b) => (a.endDate > b.endDate) ? 1 : -1)
            res.render('your-listing-active', {orders:listings})
        })

    }, 
    getCompleted: function(req, res) {
        var userID = req.session._id
			
        db.findMany(Listing, {listingOwner:userID, status:'inactive'}, {}, function(results) {
            var listings = []
            for (var i=0; i<results.length ; i++){ 
                var image = results[i].images[0]
                var name = results[i].name
                var highestBid = results[i].highestBid
                var highestBidder = results[i].highestBidder
                var endDate = results[i].endDate.toDateString()
                var _id = results[i]._id
                var listing = {
                    image: image,
                    name: name,
                    highestBid:highestBid,
                    highestBidder:highestBidder,
                    endDate:endDate,
                    _id:_id
                }
                listings.push(listing)
            }
            listings.sort((a,b) => (a.endDate > b.endDate) ? 1 : -1)
            res.render('your-listing-completed', {orders:listings})
        })
		
	},
	getTimes: function(req, res){
		var useremail = req.session.email
		db.findMany(Participation, {email:userEmail, status:'active'}, null, function(result) {
			var ids = []
			for(var i=0; i<result.length; i++)
				ids.push(result[i].listingId)
				
			ids = [...new Set(ids)]
			
			db.findMany(Listing, {_id:ids}, {}, function(results) {
				var orders = []
				for (var i=0; i<results.length ; i++){ 

					var image = results[i].images[0]
					var name = results[i].name
					var highestBid = results[i].highestBid
					var highestBidder = results[i].highestBidder
					var endDate = results[i].endDate.toString()
					var _id = results[i]._id
					var order = {
						image: image,
						name: name,
						highestBid:highestBid,
						highestBidder:highestBidder,
						endDate:endDate,
						_id:_id
					}
                    orders.push(order)
                    console.log(endDate)
				}
				res.send(orders).status(200)
			})
		})	
		
	},
}

function msToTime(duration) {
	var days = Math.floor((duration / (1000*60*60*24))),
	  minutes = Math.floor((duration / (1000 * 60)) % 60),
	  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
  
	return days + "d:"+hours + "hr:" + minutes + "min";
}

module.exports = activeController;