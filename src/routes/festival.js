var express = require('express');
var commons = require('../commons');
var routerFestival = express.Router();

var Festival = require('../models/festival');

/* GET festivals listing. */
routerFestival.use(function(req, res, next) {
	res.locals.page = 'festival';
	return next();
});

/* POST Create Festival */
routerFestival.post('/ajouter', commons.requireRole('moderateur'), function(req, res, next) {
	console.log("Route /festival/ajouter/ -- Début");

	Festival.createFestival(req.body.inputName, req.body.inputCity, req.body.inputCountry,  
		req.body.inputWebSite, req.body.inputFacebook, req.body.inputInstagram, req.body.inputTwitter)
		.then(function(festival){
			console.log("Route /festival/ajouter  -- Fin");
			res.status(201).send();
		})
		.catch(function(err){
			console.log("Route /festival/ajouter/ --  Erreur -- Fin");
				res.status(400).send({ error: err.message });
		});
});

/* POST Create Festival */
routerFestival.post('/modifier', commons.requireRole('moderateur'), function(req, res, next) {
	console.log("Route /festival/modifier/ -- Début");

	Festival.updateFestival(req.body.inputIdFestival, req.body.inputName, req.body.inputCity, req.body.inputCountry,  
		req.body.inputWebSite, req.body.inputFacebook, req.body.inputInstagram, req.body.inputTwitter)
		.then(function(festival){
			console.log("Route /festival/modifier  -- Fin");
			res.status(201).send();
		})
		.catch(function(err){
			console.log("Route /festival/modifier/ --  Erreur -- Fin");
				res.status(400).send({ error: err.message });
		});
});

/* GET delete a festival */
routerFestival.get('/supprimer/:id', commons.requireRole('moderateur'), function(req, res, next) {
	console.log("Route /festival/supprimer/id -- Fin");

	Festival.findById(req.params.id, function(err, festival){
		if(err || !festival){
			console.log("Route /festival/supprimer/id -- Erreur -- Fin");
			res.status(404).send({ error : "Le festival demandée est introuvable." });
		}else{
			festival.remove(function(err, next){
				console.log("Route /festival/supprimer/id -- Fin");
				res.status(201).send();
			});
		}
	});
});

/* GET display a festival with his current edition*/
routerFestival.get('/id/:id', function(req, res, next) {
	console.log("Route /festival/id/ -- Début");

	Festival.findById(req.params.id)
	.populate('editionInUse')
	.populate('editions')
	.sort([['editions.year', 'descending']])
	.exec(function(err, festival){
		if(err || !festival){
			console.log("Route /festival/id/ -- Erreur -- Fin");
			res.status(404).send({ error : "Le festival demandée est introuvable." });
		}else{
			res.status(200).send(festival);
		}
	});
});

/* GET display a festival with his current edition, get only the template*/
routerFestival.get('/:id/*', function(req, res, next) {
	console.log("Route /festival/id/ -- Début");
	console.log("Route /festival/id/ -- Fin");
	res.render('festivals/festival');
});

/* GET display a festival with a previous edition*/
routerFestival.get('/:id/*/:idEdition', function(req, res, next) {
	console.log("Route /festival/id/name/idedition -- Début");

	//TODO
});

module.exports = routerFestival;
