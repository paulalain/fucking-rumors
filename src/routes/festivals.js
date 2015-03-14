var express = require('express');
var router = express.Router();

var Festival = require('../models/festival');

/* GET festivals listing. */
router.get('/', function(req, res, next) {
	var listeFestival = '';

	var festivals = Festival.find(function(err, festivalsList) {
		if (err){
			return console.error(err);
		}else{
			res.render('festivals', { festivals: festivalsList });
		}
	});
});

/* GET festivals listing. */
router.get('/save/', function(req, res, next) {
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

module.exports = router;
