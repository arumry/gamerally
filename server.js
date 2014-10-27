//Imported modules and globals for module app
var env = require('./env/env');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gally');
global.mongoose = mongoose;
var db = mongoose.connection;
var express = require('express');
var routes = require('./lib/routes/routes');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportStart = require('./lib/services/passport');
var SteamStrategy = require('./node_modules/passport-steam/lib/passport-steam').Strategy;
var app = express();
var port = 8500;

//Middleware
app.use(bodyParser.json());
app.use(session({ secret:  env.express.secret, saveUninitialized: true, resave: true}));
passportStart(passport, SteamStrategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

//Routes 
routes(app, passport);

//Mongoose connection check
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose connected!');
});

//Instantiate server
app.listen(port, function(){
	console.log('Server running on port: ' + port);
});