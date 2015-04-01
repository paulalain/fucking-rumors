var express = require('express');
var commons = require('../commons');
var routerArtists = express.Router();

var Artist = require('../models/artist');

/* GET Page in use. */
routerArtists.use(function(req, res, next) {
	res.locals.page = 'artiste';
	return next();
});

/* GET render artists listing template. */
routerArtists.get('/', function(req, res, next) {
	console.log("Route /artists/ -- Début");
	console.log("Route /artists/ -- Fin");
	res.render('artists/artists');
});


/* GET All artists */
routerArtists.get('/list', function(req, res, next) {
	console.log("Route /artistes-- Début");

	Artist.find({})
		.deepPopulate('rumors rumors.edition rumors.edition.festival rumors.rumors')
		.exec(function(err, artists){
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
routerArtists.get('/:id', function(req, res, next) {
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
routerArtists.get('/search/:name', function(req, res, next) {
	console.log("Route /artistes/search/name -- Début");

	var r = new RegExp(req.params.name, 'i');
	Artist.find({ name:  { $regex:r }})
		.deepPopulate('rumors rumors.edition rumors.edition.festival rumors.rumors')
		.exec(function(err, artists){
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
routerArtists.get('/supprimer/:id', commons.requireRole('moderateur'), function(req, res, next) {
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
routerArtists.post('/ajouter', commons.requireRole('moderateur'), function(req, res, next) {
	console.log("Route /artistes/ajouter -- Début");

	Artist.checkArtistValues(req.body.name)
		.then(function(artistFind){
			if(!artistFind){
				//create a new artist
				Artist.createArtist(req.body.name, req.body.website, req.body.facebook, req.body.instagram, req.body.twitter, req.body.img)
				.then(function(artist){
					console.log("Route /artistes/ajouter  -- Fin");
					res.status(201).send(artist);
				}).catch(function (err) {
					console.log("Route /artistes/ajouter -- Catch 1");
					console.log("Erreur : " + err);
					res.status(400).send({ error: err.message });
				});
			}
		})
		.catch(function (err) {
			console.log("Route /artistes/ajouter -- Catch 2");
			console.log("Erreur : " + err);
			res.status(400).send({ error: err.message });
		});
});


module.exports = routerArtists;