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
  	console.log(username);
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
	var username = req.body.inputPseudoInscription;
	var mail = req.body.inputEmailInscription;
	var password = req.body.inputPasswordInscription;
	var passwordConfirmation = req.body.inputPasswordInscriptionConfirmation;
	
	var error = false;

	// check if username is more than 4 caracters
	if(!error && (!username || !(username.length > 4))){
		res.status(400).send({ error : 'Le pseudo doit faire au minimum 5 caractères.' })
		error = true;
	}

	// check if username is correct
	if(!error && /[^a-zA-Z0-9]/.test(username)){
		res.status(400).send({ error : 'Le pseudo doit être en alpha-numérique.' })
		error = true;
	}

	// check if password is securized
	if(!error && (!password || !(password.length > 7))){
		res.status(400).send({ error : 'Le mot de passe saisi est trop court.' })
		error = true;
	}

	//check if passwords are the same
	if(!error && (password != passwordConfirmation)){
		res.status(400).send({ error : 'Les deux mots de passes saisis sont différents.' })
		error = true;
	}

	if(!error){
		//check if user exists
		User.checkIfUserExists(username)
			.then(User.checkIfMailExists.bind(null, mail))
			.then(User.createUser.bind(null, username, mail, password))
			.then(function (user) {
				// connect the user
				req.body.pseudoInputLogin = username;
				req.body.passwordInputLogin = password;
				passport.authenticate('local', function(err, user, info) {
				    if (err) { 
				    	return next(err); 
				    }
				    if (!user) {
				    	res.status(201).send(user);
				    }
				    req.logIn(user, function(err) {
				    	if (err) {
				    		return next(err); 
				    	}
				      	res.status(201).send(user);
				    });
				  })(req, res, next);
			}).catch(function (err) {
				res.status(401).send({ error: err.message });
			});
	}else{
		next(err);
	}
});

// ROUTE LOGIN
indexrouter.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if(user){
			req.logIn(user, function(err) {
		    	if (err) {
		    		res.status(401).send({ error : 'Impossible de s\'identifier' });
		    	}
		      	res.status(201).send(user);
		    });
		}else{
			res.status(401).send({ error : 'Impossible de s\'identifier' });
		}
  	})(req, res, next);
});

// ROUTE LOGOUT
indexrouter.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// put user information in locals
indexrouter.use(function(req, res, next) {
  // just use boolean for loggedIn
  res.locals.loggedIn = (req.user) ? true : false;
  res.locals.admin = true;
  res.locals.user = req.user;
  res.locals.page = 'accueil';
  res.locals.title = 'Fucking rumors baby';
  next();
});

//ROUTE HOME PAGE
indexrouter.get('/', function(req, res, next) {
  res.render('index', {  });
});

module.exports = indexrouter;