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
	console.log("Route /signup -- Début");

	var username = req.body.inputPseudoInscription;
	var mail = req.body.inputEmailInscription;
	var password = req.body.inputPasswordInscription;
	var passwordConfirmation = req.body.inputPasswordInscriptionConfirmation;
	
	User.checkFieldsSignup(username, password, passwordConfirmation).
	then(User.checkIfUserExists(username))
		.then(User.checkIfMailExists.bind(null, mail))
		.then(User.createUser.bind(null, username, mail, password))
		.then(function (user) {
			// connect the user
			req.body.pseudoInputLogin = username;
			req.body.passwordInputLogin = password;
			passport.authenticate('local', function(err, user, info) {
			    if (err) { 
			    	console.log("Route /signup -- Ereur -- Fin");
			    	return next(err); 
			    }
			    if (!user) {
			    	console.log("Route /signup -- Erreur -- Fin");
			    	return next(); 
			    }
			    req.logIn(user, function(err) {
			    	if (err) {
			    		console.log("Route /signup -- Erreur -- Fin");
			    		return next(err); 
			    	}else{
			    		console.log("Route /signup -- Fin");
			    		res.status(201).send(user);
			    	}
			    });
			  })(req, res, next);
		}).catch(function (err) {
			console.log("Route /signup -- Erreur -- Fin");
			res.status(401).send({ error: err.message });
		});
});

// ROUTE LOGIN
indexrouter.post('/login', function(req, res, next) {
	console.log("Route /login -- Début");

	passport.authenticate('local', function(err, user, info) {
		if(user){
			req.logIn(user, function(err) {
		    	if (err) {
		    		console.log("Route /login -- Erreur -- Fin");
		    		res.status(401).send({ error : 'Impossible de s\'identifier' });
		    	}else{
		    		console.log("Route /login -- Fin");
		    		res.status(201).send(user);
		    	}
		    });
		}else{
			console.log("Route /login -- Erreur -- Fin");
			res.status(401).send({ error : 'Impossible de s\'identifier' });
		}
  	})(req, res, next);
});

// ROUTE LOGOUT
indexrouter.get('/logout', function(req, res){
	console.log("Route /logout -- Début");

  	req.logout();
  	console.log("Route /logout -- Fin");

  	// redirect action TODO FRONT !
  	res.redirect('/');
});

// put user information in locals
indexrouter.use(function(req, res, next) {
	// just use boolean for loggedIn
	console.log("Route use -- Locals vars -- Début");
	res.locals.loggedIn = (req.user) ? true : false;
	res.locals.admin = res.locals.loggedIn && true;
	res.locals.moderateur = res.locals.loggedIn && true;
	res.locals.user = req.user;
	res.locals.page = 'accueil';
	res.locals.title = 'Fucking rumors baby';
	console.log("Route use -- Locals vars -- Fin");
	next();
});

//ROUTE HOME PAGE
indexrouter.get('/', function(req, res, next) {
	console.log("Route / -- Début");
  	res.render('index', {  });
  	console.log("Route / --  Fin");
});

module.exports = indexrouter;