const db = require('../models/db.js');
const User = require('../models/UserModel.js');
const bcrypt = require('bcryptjs');

const loginController = {
	login: function(req,res){
		res.render('login');
	},
	postLogin: function (req, res) {
		var query = {email: req.body.email};
		var password = req.body.password;

		var projection = null;

		db.findOne(User, query, projection, function (result){
			if(result != null){
				bcrypt.compare(password, result.password, function(err, equal) {
					if(equal){
						req.session.email = req.body.email;
						req.session.firstname = result.firstname;
						req.session._id = result._id;
						res.redirect('/');
					}
                    else {
                    }

                });	
			}
			else {
			}
		})
	},
	getCheckLogin: function(req, res) {
		var query = {email: req.query.email};
		var password = req.query.password
		var projection = null;

		db.findOne(User, query, projection, function (result){
			if(result != null){
				bcrypt.compare(password, result.password, function(err, equal) {
					if(equal){
						res.send(true)
					}
                    else {
                    	res.send(false)
                    }

                });	
			}
			else {
				res.send(false)
			}
		})
	}
}

module.exports = loginController;