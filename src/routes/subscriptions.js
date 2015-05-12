var express = require('express');
var commons = require('../commons');
var routerSubscription = express.Router();

var Festival = require('../models/festival');
var Artist = require('../models/artist');
var Subscription = require('../models/subscription');

/* GET list of artists subscriptions */
routerSubscription.get('/artistsSubscriptions', commons.requireRole('user'), function(req, res, next) {
	console.log("Route /artistsSubscriptions -- Début");

	var idUser = req.res.locals.user._id;
	//check if festival exists
	Subscription.getSubscriptionByIdUser(idUser)
		.then(function(subscription){
			if(subscription){
				console.log("Route /subscriptions/artistsSubscriptions -- Fin");
				return res.status(200).send(subscription.artists);
			}else{
				console.log("Route /subscriptions/artistsSubscriptions -- Error ");
				res.status(400).send({ error : "Impossible d'accèder à la liste des abonnements aux artistes d'un user." });
			}
		});
});

/* GET list of festivals subscriptions */
routerSubscription.get('/festivalsSubscriptions', commons.requireRole('user'), function(req, res, next) {
	console.log("Route /artistsSubscriptions -- Début");

	var idUser = req.res.locals.user._id;
	//check if festival exists
	Subscription.getSubscriptionByIdUser(idUser)
		.then(function(subscription){
			if(subscription){
				console.log("Route /subscriptions/festivalsSubscriptions -- Fin");
				return res.status(200).send(subscription.festivals);
			}else{
				console.log("Route /subscriptions/festivalsSubscriptions -- Error ");
				res.status(400).send({ error : "Impossible d'accèder à la liste des abonnements aux artistes d'un user." });
			}
		});
});

/* GET Create Festival Subscription */
routerSubscription.get('/subscribeFestival/:idFestival', commons.requireRole('user'), function(req, res, next) {
	console.log("Route /subscriptions/subscribeFestival -- Début");

	var idUser = req.res.locals.user._id;
	//check if festival exists
	Festival.findByIdFestival(req.params.idFestival)
	.then(function(festival){
		Subscription.addFestivalSubscription(idUser, req.params.idFestival)
		.then(function(subscription){
			console.log("Route /subscriptions/subscribeFestival -- Fin");
			res.status(201).send();
			return;
		}).catch(function (err) {
			console.log("Route /subscriptions/subscribeFestival -- Catch ");
			console.log("Erreur : " + err);
			res.status(400).send({ error: err.message });
		});
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
    //check if artist exists
    Artist.findByIdArtist(req.params.idArtist)
	Subscription.addArtistSubscription(idUser, req.params.idArtist)
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

/* GET Delete Festival Subscription */
routerSubscription.get('/unSubscribeFestival/:idFestival', commons.requireRole('user'), function(req, res, next) {
	console.log("Route /subscriptions/unSubscribeFestival -- Début");

	var idUser = req.res.locals.user._id;
	//check if festival exists
	Festival.findByIdFestival(req.params.idFestival)
	.then(function(festival){
		if(festival){
			Subscription.deleteFestivalSubscription(idUser, req.params.idFestival)
					.then(function(subscription){
						console.log("Route /subscriptions/unSubscribeFestival -- Fin");
						res.status(201).send();
						return;
					}).catch(function (err) {
						console.log("Route /subscriptions/unSubscribeFestival -- Catch ");
						console.log("Erreur : " + err);
						res.status(400).send({ error: err.message });
					});
		}else{
			res.status(400).send({ error: "Aucun festival ne correspond." });
		}
		
	})
	.catch(function (err) {
		console.log("Route /subscriptions/unSubscribeFestival -- Catch ");
		console.log("Erreur : " + err);
		res.status(400).send({ error: err.message });
	});
});

/* GET Delete Artist Subscription */
routerSubscription.get('/unSubscribeArtist/:idArtist', commons.requireRole('user'), function(req, res, next) {
	console.log("Route /subscriptions/unSubscribeArtist -- Début");

	var idUser = req.res.locals.user._id;
    //check if artist exists
    Artist.findByIdArtist(req.params.idArtist)
	.then(function(artist){
		if(artist){
			Subscription.deleteArtistSubscription(idUser, req.params.idArtist)
			.then(function(subscription){
				console.log("Route /subscriptions/unSubscribeArtist -- Fin");
				res.status(201).send();
				return;
			})
			.catch(function (err) {
				console.log("Route /subscriptions/unSubscribeArtist -- Catch ");
				console.log("Erreur : " + err);
				res.status(400).send({ error: err.message });
			});
		}else{
			res.status(400).send({ error: "Aucun artiste ne correspond." });
		}
	})
	.catch(function (err) {
		console.log("Route /subscriptions/unSubscribeArtist -- Catch ");
		console.log("Erreur : " + err);
		res.status(400).send({ error: err.message });
	});
});

module.exports = routerSubscription;
