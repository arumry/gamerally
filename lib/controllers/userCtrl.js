var Service = require('../services/userSvc');
var passport = require('passport');
module.exports = {
	noop: function(req, res){},
	steamLogin: function(req, res){
		res.redirect('/#/profile');
	}
};