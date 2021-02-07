const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
const Participation = require("../models/ParticipationModel.js");
const User = require("../models/UserModel.js");

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
                var { images, name, highestBid, highestBidder, endDate, _id, soldToUser } = results[i]
                var listing = {
                    image: images[0],
                    name: name,
                    highestBid:highestBid,
                    highestBidder:highestBidder,
                    endDate:endDate.toDateString(),
                    soldToUser: soldToUser,
                    _id:_id
                }
                listings.push(listing)
            }
            listings.sort((a,b) => (a.endDate > b.endDate) ? 1 : -1)
            res.render('your-listing-completed', {orders:listings})
        })
		
	},
	getWinnerInfo: function(req, res){
            db.findOne(User, {_id: req.query.soldToUser}, {}, function(result){
                const { firstname, lastname, phonenum, email, address, city } = result
                const winner = {
                    firstname: firstname,
                    lastname: lastname,
                    phonenum: phonenum,
                    email: email,
                    address: address,
                    city: city
                }
                res.status(200).send(winner)
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