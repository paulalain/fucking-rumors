var express = require('express');
var authRouter = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jwt-simple');
var moment = require('moment');

var User = require('../models/user.js');

authRouter.use(passport.initialize());
authRouter.use(passport.session());

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

authRouter.post('/signup', function (req, res, next) {
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

authRouter.post('/login', function (req, res, next) {
	passport.authenticate('local', 
		function (err, user, info) {
			if (user) {
				var expires = moment().add(7, 'days').valueOf();
				var token = jwt.encode({
					iss: user.id,
					exp: expires
				}, app.get('jwtTokenSecret'));

				res.status(200).json({
					token: token,
					expires: expires,
					user: user
				});
			} else {
				res.status(403).send({ error: err });
			}
	})(req, res, next);
});

module.exports = authRouter;