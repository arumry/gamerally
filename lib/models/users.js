var friends = require('mongoose-friends');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');
var Moment = require('moment');
var ObjectID =  mongoose.Schema.Types.ObjectId;
var strValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 300],
    message: 'Bio should be between 0 and 300 characters'
  })
];

var schema = mongoose.Schema({
    steamid: {type: String, unique: true, required: true},
    displayname: {type: String, unique: true, required: true},
    profileurl: {type: String, unique: true},
    avatar: {type: String, unique: true},
    age: {type: Number, min: 15, max:100},
    bio: {type: String, validate: strValidator, required: true, default: 'No bio entered'},
    type: {type: String, enum:['Casual', 'Pro', 'Hardcore'], required: true, default: 'Casual'},
    games: [{
    	title: {type: String, trim: true, unique: true, required: true},
    	avail: {type: String, required: true}
    }],
    inbox: [{ 
    	sender: {type: ObjectID, ref: 'User'},
    	sent: {type: Date, required: true, default: Moment().utc().toDate()},
    	message: {type: String, validate: strValidator}
    }],
    countercheck: [{type: ObjectID, unique: true}]
});

schema.plugin(friends({pathName: "friends"}));
schema.plugin(uniqueValidator);

var User = mongoose.model("User", schema);
module.exports = User;