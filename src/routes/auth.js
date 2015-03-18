var express = require('express');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var indexrouter = express.Router();

var User = require('../models/user.js');

indexrouter.use(session({ secret: 'keyboard cat' }));
indexrouter.use(passport.initialize());
indexrouter.use(passport.session());

//PASSPORT USING
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy({
    usernameField: 'pseudoInputLogin',
    passwordField: 'passwordInputLogin'
  }, function (username, password, done) {
	User.checkIfValidUser(username, password)
		.then(function (user) {
			done(null, user, true);
		})
		.catch(function (err) {
			done(err);
		});
}));

// ROUTE SIGNUP
indexrouter.post('/signup', function (req, res, next) {
	if(req.body.inputPasswordInscription != req.body.inputPasswordInscriptionConfirmation){
		res.status(400).send({ error : 'La confirmation du mot de passe n\'est pas correcte' })
		next();
	}
	User.checkIfUserExists(req.body.inputPseudoInscription)
		.then(User.createUser(req.body.inputPseudoInscription, req.body.inputEmailInscription, req.body.inputPasswordInscription))
		.then(function (user) {
			res.status(201).send(user);
		}).catch(function (err) {
			res.status(400).send({ error: err.message });
		});
});

// ROUTE LOGIN
indexrouter.post('/login', 
	passport.authenticate('local', {
	    successRedirect: '/',
	    failureRedirect: '/',
	    failureFlash : true 
}));

// ROUTE LOGOUT
indexrouter.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// put user information in locals
indexrouter.get('*', function(req, res, next) {
  // just use boolean for loggedIn
  res.locals.loggedIn = (req.user) ? true : false;
  next();
});

//ROUTE HOME PAGE
indexrouter.get('/', function(req, res, next) {
  res.render('index', {  });
});

module.exports = indexrouter;