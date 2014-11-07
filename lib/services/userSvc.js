var Promise = require('bluebird'),
	User = require('../models/users.js'),
  nn = require('./nn.js');
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);


//Main services
module.exports.getCounterCheck = function(id){
	return User.findOneAsync({'_id': id}, '-_id countercheck');
};

module.exports.getCompareUsers = function(viewed){
	viewed = viewed ? viewed : []
	return Promise.resolve(User.find({
    '_id': { $nin: viewed},
	}, '-countercheck -friends -inbox -steamid').lean().exec());
};

module.exports.updateUserSettings = function(id, settings){
  return User.findByIdAndUpdateAsync(id, settings);
};

//Mail services
module.exports.getInbox = function(id){
	return Promise.resolve(User.findOne({'_id': id}, 'inbox').populate({path: 'inbox.sender', select: '-inbox -countercheck -games -friends -steamid -avatarlg'}).exec());
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

module.exports.sendMail = function(message, receiverId){
return User.updateAsync({_id: receiverId}, {$push: {inbox: message}});
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

module.exports.editGame = function(id, gameId, game){
	return User.updateAsync(
    { 
        "_id": id,
        "games._id": gameId
    },
    { 
        "$set": { 
            "games.$": game
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

//Find gamer services
module.exports.getSimilarGamer = function(user, users, cb){
  return nn(user, users, cb);
};
