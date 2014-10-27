var Ctrl = require('../controllers/userCtrl');

//Auth middleware
var checkAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(403).end();
}

module.exports = function(app, passport){
    app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/login' }), Ctrl.noop);
    app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/login' }), Ctrl.steamLogin);
   
}