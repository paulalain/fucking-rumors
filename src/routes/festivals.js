var express = require('express');
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

	var festivals = Festival.find(function(err, festivalsList) {
		if (err){
			console.log("Route /festivals/ -- Erreur -- Fin");
			return next(err);
		}else{
			console.log("Route /festivals/ -- Fin");
			res.render('festivals/festivals', { festivals: festivalsList });
		}
	});
});


/* POST Create Festival */
routerFestivals.post('/ajouterFestival', function(req, res, next) {
	console.log("Route /festivals/ajouterFestival/ -- Début");

	if(!res.locals.admin){
		res.status(401).send({ error: "Accès non authorisé." });
	}

	var festival = new Festival({
	  name: req.body.inputName,
	  city: req.body.inputCity,
	  country: req.body.inputCountry,
	  website: req.body.inputWebSite
	});

	festival.save(function (err) {
			if (err) {
				console.log("Route /festivals/ajouterFestival/ --  Erreur -- Fin");
				res.status(400).send({ error: err.message });
			}else{
				console.log("Route /festivals/ajouterFestival/ -- Fin");
				res.status(201).send();
			}
		}
	);
});

/* GET delete a festival */
routerFestivals.get('/supprimer/:id', function(req, res, next) {
	console.log("Route /festivals/supprimer/id -- Fin");

	if(!res.locals.admin){
		res.status(401).send({ error: "Accès non authorisé." });
	}
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
		if(!festival){
			console.log("Route /festivals/id/ -- Erreur -- Fin");
			res.status(404).send();
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
		if(!festival){
			console.log("Route /festivals/id/name/idedition -- Erreur -- Fin");
			res.status(404).send;
		}else{
			console.log("Route /festivals/id/name/idedition -- Fin");
			res.render('festivals/festival', { festival : festival });
		}
	});
});

module.exports = routerFestivals;
