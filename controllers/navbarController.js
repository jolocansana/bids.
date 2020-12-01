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
    }
}

module.exports = navbarController