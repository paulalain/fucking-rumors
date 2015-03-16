var express = require('express');
var routerFestivals = express.Router();

var Festival = require('../models/festival');

/* GET festivals listing. */
routerFestivals.get('/', function(req, res, next) {
	var listeFestival = '';

	var festivals = Festival.find(function(err, festivalsList) {
		if (err){
			return console.error(err);
		}else{
			res.render('festivals', { festivals: festivalsList });
		}
	});
});

/* GET Festival Form */
routerFestivals.get('/ajouter', function(req, res, next) {
	res.render('ajouterfestival', {  });
});

/* POST Create Festival */
routerFestivals.post('/ajouter', function(req, res) {
	console.log('Name' + req.body.inputName)
	//res.render('ajouterfestival', {  });
	res.send('POST request to homepage');
});

/* GET festivals listing. */
routerFestivals.get('/save/', function(req, res, next) {
	var routeDurock = new Festival({
	  name: 'La Route du Wok'
	});

	routeDurock.save(function (err) {
			if (err) {
				console.log ('Error on save!');
			}
		}
	);
});

module.exports = routerFestivals;
