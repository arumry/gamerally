var Ctrl = require('../controllers/userCtrl');
var middleware = require('../middleware/middleware');

module.exports = function(app, passport){
    app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/login' }), Ctrl.noop);
    app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/login' }), Ctrl.steamLogin);  
}