const db = require("../models/db.js");
const Listing = require("../models/ListingModel.js");
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
		res.render('bidding-history-completed')
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