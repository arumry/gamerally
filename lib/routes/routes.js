var Ctrl = require('../controllers/userCtrl');
var middleware = require('../middleware/middleware');

module.exports = function(app, passport){
	//Steam auth and callback url endpoints
    app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/#/login' }), Ctrl.noop);
    app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/#/login', successRedirect: '/#/profile' }), Ctrl.steamLogin); 
    app.get('/auth/steam/logout', middleware.checkAuth, Ctrl.steamLogout);
    
    //User endpoints
    app.get('/user', middleware.checkAuth, Ctrl.getUser);
    app.get('/game', middleware.checkAuth, Ctrl.searchGames);
    app.post('/game', middleware.checkAuth, Ctrl.addGame);
};