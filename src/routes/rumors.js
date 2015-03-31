var express = require('express');
var commons = require('../commons');
var routerRumors = express.Router();

var Rumor = require('../models/rumor');
var Edition = require('../models/edition');
var Artist = require('../models/artist');

/* GET Page in use. */
routerRumors.use(function(req, res, next) {
	res.locals.page = 'artiste';
	return next();
});

/* GET render artists listing template. */
routerRumors.get('/', function(req, res, next) {
	console.log("Route /artists/ -- Début");
	console.log("Route /artists/ -- Fin");
	res.render('artists/artists');
});


/* GET All artists */
routerRumors.get('/list', function(req, res, next) {
	console.log("Route /artistes-- Début");

	Artist.find({}, function(err, artists){
		if(err || !artists){
			console.log("Route /artistes -- Erreur -- Fin");
			res.status(400).send({ error : "L'artiste demandé est introuvable." });
		}else{
			console.log("Route /artists -- Fin");
			return res.status(200).send(artists);
		}
	});
});

/* GET artist by id */
routerRumors.get('/:id', function(req, res, next) {
	console.log("Route /artistes/id -- Début");

	Artist.findbyId(req.params.id, function(err, artist){
		if(err || !artist){
			console.log("Route /artistes/id -- Erreur -- Fin");
			res.status(400).send({ error : "L'artiste demandé est introuvable." });
		}else{
			console.log("Route /artistes/id -- Fin");
			return res.status(200).send(artist);
		}
	});
});

/* GET artists with name */
routerRumors.get('/search/:name', function(req, res, next) {
	console.log("Route /artistes/search/name -- Début");

	var r = new RegExp(req.params.name, 'i');
	Artist.find({ name:  { $regex:r }}, function(err, artists){
		if(err || !artists){
			console.log("Route /artistes/search/name -- Erreur -- Fin");
			res.status(400).send({ error : "L'artiste demandé est introuvable." });
		}else{
			console.log("Route /artistes/search/name -- Fin");
			return res.status(200).send(artists);
		}
	});
});

/* GET delete an artist */
routerRumors.get('/supprimer/:id', commons.requireRole('moderateur'), function(req, res, next) {
	console.log("Route /artistes/supprimer/id -- Début");

	Artist.findById(req.params.id, function(err, artist){
		if(err || !artist){
			console.log("Route /artists/supprimer/id -- Erreur -- Fin");
			res.status(400).send({ error : "L'artiste demandé est introuvable." });
		}
		artist.remove(function(err, next){
			console.log("Route /artistes/supprimer/id -- Fin");
			res.status(201).send();
			return;
		})
	});
});

/* POST Create artist */
routerRumors.post('/ajouter', commons.requireRole('moderateur'), function(req, res, next) {
	console.log("Route /rumeurs/ajouter -- Début");

	Rumor.checkArtistAlreadyRumoredOnEdition(req.body.idArtist, req.body.idEdition)
		.then(function(rumorFind){
			if(!rumorFind){
				//create a new rumor
				Rumor.createRumor(req.body.idArtist, req.body.idEdition, req.body.rumors, req.body.official)
				.then(function(rumor){
					//add rumor to edition
					Edition.findById(req.body.idEdition, function(err, edition){
						if(err || !edition){
							//remove rumor
							rumor.remove(function(err, next){
								if(err){
									console.log("Erreur fatale : " + err);
									res.status(400).send({ error : err });
								}
							})
							console.log("Route /rumeurs/ajouter -- Erreur -- Fin");
							res.status(400).send({ error : "L'édition demandée est introuvable." });
							return;
						}else{
							Edition.addRumor(edition, rumor);
						}
					});

					//add rumor to artist
					Artist.findById(req.body.idArtist, function(err, artist){
						if(err || !artist){
							//remove rumor
							rumor.remove(function(err, next){
								if(err){
									console.log("Erreur fatale : " + err);
									res.status(400).send({ error : err });
								}
							})
							console.log("Route /rumeurs/ajouter -- Erreur -- Fin");
							res.status(400).send({ error : "L'artiste demandé est introuvable." });
							return;
						}else{
							Artist.addRumor(artist, rumor);
						}
					});

					console.log("Route /rumeurs/ajouter  -- Fin");
					res.status(201).send(rumor);
				}).catch(function (err) {
					console.log("Route /rumeurs/ajouter -- Catch 1");
					console.log("Erreur : " + err);
					res.status(400).send({ error: err.message });
				});
			}
		})
		.catch(function (err) {
			console.log("Route /rumeurs/ajouter -- Catch 2");
			console.log("Erreur : " + err);
			res.status(400).send({ error: err.message });
		});
});


module.exports = routerRumors;