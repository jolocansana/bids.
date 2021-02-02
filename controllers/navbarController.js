const db = require('../models/db.js');
const Notification = require('../models/NotificationModel');

const navbarController = {
	getNavbar: function(req, res){
        if(req.session.email){
            res.send(true);
        }
        else{
            res.send(false);
        }
    },
    getName: function(req, res){
        if(req.session.email){
            res.send(req.session.firstname);
        }
        else{
            res.send(false);
        }
    },
    getNotifications: function(req, res) {
        if(req.session.email){
           db.findMany(Notification,{userID:req.session._id},{}, function(notifications) {
                notifications.sort((a, b) => a.date - b.date);
                result = notifications.slice(0,5);
           });
        }
        else{
            res.send(false);
        }
    }
}

module.exports = navbarController