var Service = require('../services/userSvc');
var passport = require('passport');
var unirest = require('unirest');
var env = require('../../env/env');
var ObjectId = require('mongoose').Types.ObjectId;
var Promise = require('bluebird'); 

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

	updateUser: function(req, res){
		var id = req.user._id;
		var settings = req.body;
		Service.updateUserSettings(id, settings).then(function(){
			res.status(200).end();
		});
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
		Service.editGame(id, gameId, req.body).then(function(data){
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
	},

	sendMessage: function(req, res){
		var id = req.user._id;
		var id2 = new ObjectId(req.params.id);
		var obj = {};
		obj.sender = id;
		obj.message = req.body;
		Service.sendMail(obj, id2).then(function(result){
			res.status(200).send(result[1].updatedExisting);
		});
	},

	getMessages: function(req, res){
		var id = req.user._id;
		Service.getInbox(id).then(function(result){
			res.status(200).send(result);
		});
	},

	delMessage: function(req, res){
		var id = req.user._id;
		var messageId = new ObjectId(req.params.id);
		Service.deleteOneMail(id, messageId).then(function(result){
			res.status(200).send(result[1].updatedExisting);
		});
	},

	delAllMessages: function(req, res){
		var id = req.user._id;
		Service.deleteAllMail(id).then(function(result){
			res.status(200).send(result[1].updatedExisting);
		});
	},
	getSimilarGamer: function(req, res){
		var id = req.user._id;
		var user = JSON.parse(JSON.stringify(req.user));
		user.games = user.games.map(function(game) {
					  return game.title;
		});
		var friends = Service.getAllFriends(id);
		var countercheck = Service.getCounterCheck(id);
		var promiseArr = [friends, countercheck];
		Promise.all(promiseArr).then(function(data){
			var friends = data[0];
			var countercheck = data[1];
			var idArr = [];
			for (var i = 0; i < friends.length; i++) {
				idArr.push(friends[i]._id);
			}
			;
			idArr = idArr.concat(countercheck.countercheck);
			idArr.push(id);
			
			Service.getCompareUsers(idArr).then(function(users){
				for (var i = 0; i < users.length; i++) {
					users[i].games = users[i].games.map(function(game) {
					  return game.title;
					});
				}
				Service.getSimilarGamer(user, users, function(nearestNeighbor, probability){
					var matchedGamer = {};
					matchedGamer.user = nearestNeighbor;
					matchedGamer.percentage = probability * 100;
					res.status(200).send(matchedGamer);
				});
			});
		});
	}
};