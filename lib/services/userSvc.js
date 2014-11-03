var Promise = require('bluebird'),
	User = require('../models/users.js');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);


//Main services
module.exports.getCounterCheck = function(id){
	return User.findOneAsync({'_id': id}, ['countercheck']);
};

module.exports.getCompareUsers = function(viewed){
	viewed = viewed ? viewed : []
	return User.findOneAsync({
    '_id': { $ne: viewed}
	});
};

module.exports.getUserByID = function(id){
	return User.findOneAsync({'_id': id}, ['steamid', 'displayname', 'profileurl', 'avatar', 'type', 'bio']);
};

module.exports.getUserIDBySteamID = function(steamid){
	return User.findOneAsync({'steamid': steamid}, ['_id']);
};

//Mail services
module.exports.getInbox = function(id){
	return User.findOneAsync({'_id': id}, ['inbox']);
};

module.exports.deleteOneMail = function(id, mailId){
	return User.updateAsync( 
      { '_id': id },
      { $pull: { inbox: { _id : mailId } } },
      { safe: true });
};

module.exports.deleteAllMail = function(id){
	return User.updateAsync({'_id': id}, { $set: { inbox: [] }});
};

//Game services
module.exports.getGames = function(id){
	return User.findOneAsync({'_id': id}, 'games');
};

module.exports.postGame = function(id, game){
	return User.updateAsync(
    {_id: id, 'games.title': {$ne: game.title}}, 
    {$push: {games: game}});
};

module.exports.deleteGame = function(id, gameId){
	return User.updateAsync( 
      { '_id': id },
      { $pull: { games: { _id : gameId } } },
      { safe: true });
};

module.exports.editGameTime = function(id, gameId, newTime){
	return User.updateAsync(
    { 
        "_id": id,
        "games._id": gameId
    },
    { 
        "$set": { 
            "games.$.avail": newTime
        }
    });
};

//Friend services
module.exports.requestFriend = function(id1, id2){
	return User.requestFriendAsync(id1, id2);
};

module.exports.getAllFriends = function(id){
	return User.getFriendsAsync(id, {}, '-countercheck -inbox -steamid');
};

module.exports.removeFriend = function(id1, id2){
	return User.removeFriendAsync(id1, id2);
};
