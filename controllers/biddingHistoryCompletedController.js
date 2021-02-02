const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
const Participation = require("../models/ParticipationModel.js");
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user:'bidsph@gmail.com',
		pass:'sdibPH098'
	}
});

const completedController = {
    getCompleted: function(req, res) {
		var userEmail = req.session.email
		db.findMany(Participation, {email:userEmail, status:'won'}, null, function(result) {
			var ids = []
			for(var i=0; i<result.length; i++)
				ids.push(result[i].listingId)
				
			ids = [...new Set(ids)]
			
			db.findMany(Listing, {_id:ids}, null, function(results) {
				var orders = []
				for (var i=0; i<results.length ; i++){ 
					var image = results[i].images[0]
					var name = results[i].name
					var highestBid = results[i].highestBid
					var highestBidder = results[i].highestBidder
					var endDate = results[i].endDate.toDateString()
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
				}
				res.render('bidding-history-completed', {orders:orders})
			})
		})	
		
	},

	report: function(req, res){
		var user = req.session.email
		var mailOptions = {
			from: 'bidsph@gmail.com',
			to: 'bidsph@gmail.com',
			subject:'Reported : ' + req.body.name,
			text: "Issue: " + req.body.problem + "\n" + req.body.desc + "\nReported by: " + user
		};
		transporter.sendMail(mailOptions, function(error, info) {
			if(error) {
				res.send(false);
			}
			else {
				res.send(true);
			}
		});
	}
}

module.exports = completedController;