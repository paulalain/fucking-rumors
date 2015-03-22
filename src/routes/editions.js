var express = require('express');
var routerEdition = express.Router();

var Festival = require('../models/festival');
var Edition = require('../models/edition');

/* GET Edition listing. */
routerEdition.use(function(req, res, next) {
	res.locals.page = 'festival';
	next();
});

/* POST Create Edition */
routerEdition.post('/ajouterEdition', function(req, res, next) {
	// check if id festival exists
	Festival.findById(req.params.idFestival)
	.exec(function(err, festival){
		if(!festival){
			res.status(401).send({ error : 'Le festival n\'est pas connu.' });
		}else{
			var edition = new Edition({
			  festival : req.body.idFestival,
			  year: req.body.inputYear,
			  date: { 
			  	start : req.body.inputDateStart,
			  	end: req.body.inputDateEnd 
			  }
			});

			edition.save(function (err) {
				if (err) {
					res.status(401).send({ error: "L'édition n'a pu être sauvegardée." });
				}else{
					// Save the festival
					festival.editions.push(edition);
					festival.save();
					res.status(201).send();
				}
			});
		}
	});
});

module.exports = routerEdition;