var friends = require('mongoose-friends');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');
var Moment = require('moment');
var ObjectID =  mongoose.Schema.Types.ObjectId;
var strValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 300],
    message: 'Exceeded 300 characters'
  })
];

var schema = mongoose.Schema({
    steamid: {type: String, unique: true, required: true},
    displayname: {type: String, unique: true, required: true},
    profileurl: {type: String},
    avatarmd: {type: String},
    avatarthumb: {type: String},
    avatarlg: {type: String},
    age: {type: Number, min: 0, max:100, default: 0},
    bio: {type: String, validate: strValidator, required: true, default: 'No bio entered'},
    type: {type: String, enum:['Casual', 'Pro', 'Hardcore'], required: true, default: 'Casual'},
    games: [{
        thumb: {type: String, trim: true},
    	title: {type: String, trim: true, required: true},
    	avail: {
            start: {type: Date, required: true},
            end: {type: Date, required: true}
        },
        short_description: {type: String},
        publisher: {type: String}
    }],
    inbox: [{ 
    	sender: {type: ObjectID, ref: 'User'},
    	sent: {type: Date, required: true, default: Moment().utc().toDate()},
    	message: {type: String, validate: strValidator}
    }],
    countercheck: [{type: ObjectID}]
});

schema.plugin(friends({pathName: "friends"}));
schema.plugin(uniqueValidator);

var User = mongoose.model("User", schema);
module.exports = User;