module.exports = function (req, res) {
    if(!req.session._id) return res.redirect('/login');
}