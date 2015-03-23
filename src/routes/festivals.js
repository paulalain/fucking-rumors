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
	displayListFestival(req, res, next);
});


/* POST Create Festival */
routerFestivals.post('/ajouterFestival', function(req, res, next) {
	if(!res.locals.admin){
		res.status(401).send({ error: "Accès non authorisé." });
		return next();
	}

	var festival = new Festival({
	  name: req.body.inputName,
	  city: req.body.inputCity,
	  country: req.body.inputCountry,
	  website: req.body.inputWebSite
	});

	festival.save(function (err) {
			if (err) {
				res.status(400).send({ error: err.message });
				return next();
			}else{
				res.status(201);
				return;
			}
		}
	);
});

/* GET delete a festival */
routerFestivals.get('/supprimer/:id', function(req, res, next) {
	if(!res.locals.admin){
		res.status(401).send({ error: "Accès non authorisé." });
		return next();
	}
	Festival.findById(req.params.id, function(err, festival){
		if(err || !festival){
			res.status(400).send({ error : "Le festival demandée est introuvable." });
			return next();
		}
		festival.remove(function(err, next){
			displayListFestival(req, res, next);
		})
	});

	//TODO delete editions
});

/* GET display a festival with his current edition*/
routerFestivals.get('/:id/*', function(req, res, next) {
	Festival.findById(req.params.id)
	.populate('editionInUse')
	.populate('editions')
	.exec(function(err, festival){
		if(!festival){
			res.status(404);
			return next(err);
		}else{
			res.render('festivals/festival', { festival : festival });
			return;
		}
	});
});

/* GET display a festival with a previous edition*/
routerFestivals.get('/:id/*/:idEdition', function(req, res, next) {
	Festival.findById(req.params.id)
	.populate('editionInUse')
	.populate('editions')
	.exec(function(err, festival){
		if(!festival){
			res.status(404);
			return next(err);
		}else{
			res.render('festivals/festival', { festival : festival });
			return;
		}
	});
});

// function to fisplay festival list
function displayListFestival(req, res, next) {
	// get festival list
	var listeFestival = '';

	var festivals = Festival.find(function(err, festivalsList) {
		if (err){
			return next(err);
		}else{
			res.render('festivals/festivals', { festivals: festivalsList });
		}
	});
}

module.exports = routerFestivals;
