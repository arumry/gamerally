var Ctrl = require('../controllers/userCtrl');
var middleware = require('../middleware/middleware');

module.exports = function(app, passport){
	//Steam auth and callback url endpoints
    app.get('/auth/steam', passport.authenticate('steam'), Ctrl.noop);
    app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/#/login', successRedirect: '/#/profile' }), Ctrl.noop); 
    app.get('/auth/steam/logout', middleware.checkAuth, Ctrl.steamLogout);
    
    //User endpoints
    app.get('/user', middleware.checkAuth, Ctrl.getUser);
    app.put('/user/settings', middleware.checkAuth, Ctrl.updateUser);

    //Game endpoints
    app.get('/game', middleware.checkAuth, Ctrl.searchGames);
    app.get('/games', middleware.checkAuth, Ctrl.getGames);
    app.post('/game', middleware.checkAuth, Ctrl.addGame);
    app.put('/game/:id', middleware.checkAuth, Ctrl.editGame);
    app.delete('/game/:id', middleware.checkAuth, Ctrl.delGame);

    //Friend endpoints
    app.get('/friends/all', middleware.checkAuth, Ctrl.getAllFriends);
    app.delete('/friend/:id', middleware.checkAuth, Ctrl.deleteFriend);
    app.post('/friend/:id', middleware.checkAuth, Ctrl.requestFriend);

    //Message endpoints
    app.post('/message/user/:id', middleware.checkAuth, Ctrl.sendMessage);
    app.get('/messages', middleware.checkAuth, Ctrl.getMessages);
    app.delete('/message/:id', middleware.checkAuth, Ctrl.delMessage);
    app.delete('/messages', middleware.checkAuth, Ctrl.delAllMessages);

    //Find gamer endpoints
    app.get('/gamers/similar', middleware.checkAuth, Ctrl.getSimilarGamers);
    //app.put('/gamer/decline', middleware.checkAuth, Ctrl.declineGamer);
};