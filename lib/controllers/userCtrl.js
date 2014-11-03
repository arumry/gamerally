var Service = require('../services/userSvc');
var passport = require('passport');
var unirest = require('unirest');
var env = require('../../env/env');
var ObjectId = require('mongoose').Types.ObjectId; 

//IGN API callback
var processIGN = function(error, response, body) {
    if (!error && response.statusCode == 200) {
        res.status(200).send(body);
    }
}

//Public export of controllers for routes
module.exports = {
	noop: function(req, res){},

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

	getGames: function(req, res){
		var id = req.user._id;
		Service.getGames(id).then(function(data){
			var games = data.games;
			res.status(200).send(games);
		});
	},

	addGame: function(req, res){
		var game = req.body;
		var id = req.user._id;
		if(game.title && game.avail){
			Service.postGame(id, game).then(function(data){
				var bool = data[1].updatedExisting;
				res.status(200).send(bool);
			});
		}
	},
	
	editGame: function(req, res){
		var id = req.user._id;
		var gameId = req.params.id;
		Service.editGameTime(id, gameId, req.body).then(function(data){
			var bool = data[1].updatedExisting;
			res.status(200).send(bool);
		});
	},

	delGame: function(req, res){
		var id = req.user._id;
		var gameId = req.params.id;
		if(!id) return res.status(404).end();	
		Service.deleteGame(id, gameId).then(function(data){
			res.status(200).send(data[1].updatedExisting);
		});
	},
	
	getAllFriends: function(req, res){
		var id = req.user._id;
		Service.getAllFriends(id).then(function(allFriends){
			res.status(200).send(allFriends);
		});
	},
	
	deleteFriend: function(req, res){
		var id = req.user._id;
		var id2 = new ObjectId(req.params.id);
		Service.removeFriend(id, id2).then(function(result){
			res.status(200).send(result);
		});
	},
	
	requestFriend: function(req, res){
		var id = req.user._id;
		var id2 = new ObjectId(req.params.id);
		Service.requestFriend(id, id2).then(function(result){
			res.status(200).send(result);
		});
	}
};