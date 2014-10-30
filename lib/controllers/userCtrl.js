var Service = require('../services/userSvc');
var passport = require('passport');
var unirest = require('unirest');
var env = require('../../env/env');

//IGN API callback
var processIGN = function(error, response, body) {
    if (!error && response.statusCode == 200) {
        res.status(200).send(JSON.parse(body));
    }
}

//Public export of controllers for routes
module.exports = {
	noop: function(req, res){},

	steamLogin: function(req, res){
		if(req.user){
			res.redirect('/#/profile');
		}
	},

	steamLogout: function(req, res){
	  req.logout();
	  res.redirect('/#/login');
	},

	getUser: function(req, res){
		res.send(req.user);
	},

	searchGames: function(req, res){
		var title = req.query.title;
		if(title){
			unirest.get("https://videogamesrating.p.mashape.com/get.php?count=5&game="+title)
			.header("X-Mashape-Key", env.ign['X-Mashape-Key'])
			.end(function (result) {
  				res.send(result.body);
  			});
		} 
	},
	addGame: function(req, res){
		var game = req.body;
		var id = req.user._id;
		if(game.title && game.avail){
			Service.postGame(id, game).then(function(data){
				updated = data[1].updatedExisting;
				res.status(200).send(updated);
			});
		}
	}
};