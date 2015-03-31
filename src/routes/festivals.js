var express = require('express');
var commons = require('../commons');
var routerFestivals = express.Router();

var Festival = require('../models/festival');

/* GET festivals listing. */
routerFestivals.use(function(req, res, next) {
	res.locals.page = 'festival';
	return next();
});

/* GET festivals listing template. */
routerFestivals.get('/', function(req, res, next) {
	console.log("Route /festivals/ -- Début");
	console.log("Route /festivals/ -- Fin");
	res.render('festivals/festivals');
});


/* GET festivals listing. */
routerFestivals.get('/list', function(req, res, next) {
	console.log("Route /festivals/list -- Début");

	var festivals = Festival.find({})
					.sort([['name', 'ascending']])
					.populate('editionInUse')
					.exec(function(err, festivalsList) {
						if (err){
							console.log("Route /festivals/list -- Erreur -- Fin");
							return next(err);
						}else{
							console.log("Route /festivals/list -- Fin");
							res.json(festivalsList);
						}
					});
});

module.exports = routerFestivals;
