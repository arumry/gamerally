var User = require('../models/users');
var env = require('../../env/env');
module.exports = function(passport, SteamStrategy){
    passport.use(new SteamStrategy({
      returnURL: env.steam.returnURL,
      realm: env.steam.realm,
      apiKey: env.steam.apiKey
    },
      function(identifier, profile, done) {
        User.findOne({steamid: profile.id }, function(err, user) {
            if(err) { done(err); }
            if (!err && user != null) {
              done(null, user);
            } else {
              var user = new User({
                steamid: profile.id, 
                displayname: profile.displayName,
                profileurl: profile._json.profileurl,
                avatar: profile._json.avatarmedium
              });
              user.save(function(err, user) {
                if(err) {
                  done(err);
                } else {
                  done(null, user);
                };
              });
            };
        });
      }
    ));

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
     User.findById(id, function(err, user){
         if(!err) done(null, user);
         else done(err, null);
     })
    });
};



