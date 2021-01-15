const db = require('../models/db.js');
const User = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const saltRounds = 10;
const passwordComplexity = require('joi-password-complexity').default;
const passwordOptions = {
	min: 7,
	max: 15,
	numeric: 1,
	requirementCount: 1
}

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
	},
	postChangePassword: async function(req, res) {

		const user_id = req.session._id;

		const { error } = passwordComplexity(passwordOptions, "Password").validate(req.body.password);
		if(error) return res.status(400).json(error.details[0].message);

		var regExp = /[a-zA-Z]/g;
		if(!regExp.test(req.body.password)) return res.status(400).json("Password must contain at least one letter");

		if(req.body.password != req.body.confirm_password) return res.status(400).json('Confirm password does not match');

		let user = await User.findOne({ _id: user_id })
		if(!user) return res.status(400).json('user not found');

		let compare = await bcrypt.compare(req.body.password, user.password);
		if(compare) return res.status(400).json('New password is the same as your old password');

		let hash = await bcrypt.hash(req.body.password, saltRounds);

		let updateUser = await User.updateOne({ _id: user_id }, { password: hash })
		if(!updateUser) return res.status(500).json('Internal Server Error');
		
		res.send(true);
	}
}

function validateNewPassword(req) {
	const schema = Joi.object({
		password: Joi.string().min(4).max(30).required()
	});
	
	return schema.validate(req);
}

module.exports = registerController;