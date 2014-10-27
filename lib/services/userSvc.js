var Promise = require('bluebird'),
	User = require('../models/users.js');

Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports.getUserBySteamID = function(steamid, steamObj){
	
};