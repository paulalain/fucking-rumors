var express = require('express');
var routerFestivals = express.Router();

var Festival = require('../models/festival');

/* GET festivals listing. */
routerFestivals.use(function(req, res, next) {
	res.locals.page = 'festival';
	next();
});

/* GET festivals listing. */
routerFestivals.get('/', function(req, res, next) {
	displayListFestival(req, res, next);
});

/* GET Festival Form */
routerFestivals.get('/ajouter', function(req, res, next) {
	res.render('festivals/ajouterfestival', {  });
});

/* POST Create Festival */
routerFestivals.post('/ajouterFestival', function(req, res, next) {
	
	var festival = new Festival({
	  name: req.body.inputName,
	  city: req.body.inputCity,
	  country: req.body.inputCountry,
	  website: req.body.inputWebSite
	});

	festival.save(function (err) {
			if (err) {
				res.status(400).send({ error: err.message });
			}else{
				displayListFestival(req, res, next);
			}
		}
	);
});

/* GET display a festival */
routerFestivals.get('/:id', function(req, res, next) {
	Festival.findById(req.params.id, function(err, festival){
		if(!festival){
			res.status(404);
			next(err);
		}else{
			res.render('festivals/festival', { festival : festival })
		}
	});
});

/* GET delete a festival */
routerFestivals.get('/supprimer/:id', function(req, res, next) {
	Festival.findById(req.params.id, function(err, festival){
		festival.remove(function(err, next){
			displayListFestival(req, res, next);
		})
	});
});

// function to fisplay festival list
function displayListFestival(req, res, next) {
	// get festival list
	var listeFestival = '';

	var festivals = Festival.find(function(err, festivalsList) {
		if (err){
			next(err);
		}else{
			res.render('festivals/festivals', { festivals: festivalsList });
		}
	});
}

module.exports = routerFestivals;
