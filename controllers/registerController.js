const db = require('../models/db.js');
const User = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerController = {
	register: function(req,res){
		res.render('register');
	},

	postRegister: function(req,res){
		var email = req.body.email
        var phonenum = req.body.phonenum
        var firstname = req.body.firstName
		var lastname = req.body.lastName
		var username = req.body.username
		var password = req.body.password
		var birthday = req.body.birthday
		var rating = null
		var address = req.body.address
		var city = req.body.address
		var description = ''

        bcrypt.hash(password, saltRounds, function(err, hash) {
            var user = {
				email: email,
				phonenum: phonenum,
				firstname: firstname,
				lastname: lastname,
				username: username,
				password: hash,
				birthday: birthday,
				rating: rating,
				address: address,
				city: city,
				description: description
			}
            db.insertOne(User, user, function(){
                res.redirect('/')
            })
        })
	},
	getCheckEmail: function(req, res) {
        var email = req.query.email;
		db.findOne(User, {email:email}, 'email', function(result) {
			res.send(result);
		}) 
	}
}

module.exports = registerController;