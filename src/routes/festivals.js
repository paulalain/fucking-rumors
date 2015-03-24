var express = require('express');
var commons = require('../commons');
var routerFestivals = express.Router();

var Festival = require('../models/festival');

/* GET festivals listing. */
routerFestivals.use(function(req, res, next) {
	res.locals.page = 'festival';
	return next();
});

/* GET festivals listing. */
routerFestivals.get('/', function(req, res, next) {
	console.log("Route /festivals/ -- Début");
	console.log("Route /festivals/ -- Fin");
	res.render('festivals/festivals');
});

/* GET festivals listing. */
routerFestivals.get('/list', function(req, res, next) {
	console.log("Route /festivals/list -- Début");

	var festivals = Festival.find(function(err, festivalsList) {
		if (err){
			console.log("Route /festivals/list -- Erreur -- Fin");
			return next(err);
		}else{
			console.log("Route /festivals/list -- Fin");
			res.json(festivalsList);
		}
	});
});


/* POST Create Festival */
routerFestivals.post('/ajouterFestival', commons.requireRole('moderateur'), function(req, res, next) {
	console.log("Route /festivals/ajouterFestival/ -- Début");

	Festival.createFestival(req.body.inputName, req.body.inputCity, req.body.inputCountry,  
		req.body.inputWebSite, req.body.inputFacebook, req.body.inputInstagram, req.body.inputTwitter)
		.then(function(festival){
			console.log("Route /festivals/ajouterFestival  -- Fin");
			res.status(201).send();
		})
		.catch(function(err){
			console.log("Route /festivals/ajouterFestival/ --  Erreur -- Fin");
				res.status(400).send({ error: err.message });
		});
});

/* GET delete a festival */
routerFestivals.get('/supprimer/:id', commons.requireRole('moderateur'), function(req, res, next) {
	console.log("Route /festivals/supprimer/id -- Fin");

	Festival.findById(req.params.id, function(err, festival){
		if(err || !festival){
			console.log("Route /festivals/supprimer/id -- Erreur -- Fin");
			res.status(404).send({ error : "Le festival demandée est introuvable." });
		}else{
			festival.remove(function(err, next){
				console.log("Route /festivals/supprimer/id -- Fin");
				res.status(201).send();
			});
		}
	});
});

/* GET display a festival with his current edition*/
routerFestivals.get('/:id/*', function(req, res, next) {
	console.log("Route /festivals/id/ -- Début");

	Festival.findById(req.params.id)
	.populate('editionInUse')
	.populate('editions')
	.exec(function(err, festival){
		if(err || !festival){
			console.log("Route /festivals/id/ -- Erreur -- Fin");
			res.status(404);
			res.render('error', {
		      error: err
		    });
		}else{
			console.log("Route /festivals/id/ -- Fin");
			res.render('festivals/festival', { festival : festival });
		}
	});
});

/* GET display a festival with a previous edition*/
routerFestivals.get('/:id/*/:idEdition', function(req, res, next) {
	console.log("Route /festivals/id/name/idedition -- Début");

	Festival.findById(req.params.id)
	.populate('editionInUse')
	.populate('editions')
	.exec(function(err, festival){
		if(err || !festival){
			console.log("Route /festivals/id/name/idedition -- Erreur -- Fin");
			res.status(404);
			res.render('error', {
		      error: err
		    });
		}else{
			console.log("Route /festivals/id/name/idedition -- Fin");
			res.render('festivals/festival', { festival : festival });
		}
	});
});

module.exports = routerFestivals;
