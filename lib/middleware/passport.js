var User = require('../models/users');
var env = require('../../env/env');
module.exports = function(passport, SteamStrategy){
    passport.use(new SteamStrategy({
      returnURL: env.steam.returnURL,
      realm: env.steam.realm,
      apiKey: env.steam.apiKey
    },
      function(identifier, profile, done) {
        var user = {};
        user.steamid = profile.id;
        user.displayname = profile.displayName;
        user.profileurl = profile._json.profileurl;
        user.avatarthumb = profile._json.avatar;
        user.avatarmd = profile._json.avatarmedium;
        user.avatarlg = profile._json.avatarfull;

        User.findOneAndUpdate({steamid: profile.id }, user, {upsert: true}, function(err, user) {
            if(err) { done(err); }
            if (!err && user != null) {
              done(null, user);
            } 
        });
      }
    ));

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
     User.findById(id).select('-inbox -countercheck -friends').exec(function(err, user){
         if(!err) done(null, user);
         else done(err, null);
     })
    });
};