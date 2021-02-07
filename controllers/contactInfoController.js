const db = require("../models/db.js");
const User = require("../models/UserModel.js");
const registerController = require('./registerController.js')

const homeController = {
    editProfile: function(req, res){
        console.log('called')
        console.log(req.body)
    },
	edit: function(req,res){
		var query = {_id: req.session._id};
        var projection = {};
    

		db.findOne(User, query, projection, function(result) {
			res.render('edit-profile', {
				user: result,
			});
		});
	}
}

module.exports = homeController;