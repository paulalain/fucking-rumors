var express = require('express');
var commons = require('../commons');
var routerSubscription = express.Router();

var Festival = require('../models/festival');
var Edition = require('../models/edition');
var Subscription = require('../models/subscription');

/* GET Create Festival Subscription */
routerSubscription.get('/subscribeFestival/:idFestival', commons.requireRole('user'), function(req, res, next) {
	console.log("Route /subscriptions/subscribeFestival -- Début");

	var idUser = req.res.locals.user._id;

	Subscription.addFestivalSubscription(idUser, idFestival)
	.then(function(subscription){
		console.log("Route /subscriptions/subscribeFestival -- Fin");
		res.status(201).send();
		return;
	})
	.catch(function (err) {
						console.log("Route /subscriptions/subscribeFestival -- Catch ");
						console.log("Erreur : " + err);
						res.status(400).send({ error: err.message });
	});
});

/* GET Create Artist Subscription */
routerSubscription.get('/subscribeArtist/:idArtist', commons.requireRole('user'), function(req, res, next) {
	console.log("Route /subscriptions/subscribeArtist -- Début");

	var idUser = req.res.locals.user._id;

	Subscription.addArtistSubscription(idUser, idArtist)
	.then(function(subscription){
		console.log("Route /subscriptions/subscribeArtist -- Fin");
		res.status(201).send();
		return;
	})
	.catch(function (err) {
						console.log("Route /subscriptions/subscribeArtist -- Catch ");
						console.log("Erreur : " + err);
						res.status(400).send({ error: err.message });
	});
});

module.exports = routerSubscription;
