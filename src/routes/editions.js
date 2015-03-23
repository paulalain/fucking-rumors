var express = require('express');
var routerEdition = express.Router();

var Festival = require('../models/festival');
var Edition = require('../models/edition');

/* GET Edition listing. */
routerEdition.use(function(req, res, next) {
	res.locals.page = 'festival';
	return next();
});

/* POST Create Edition */
routerEdition.post('/ajouterEdition', function(req, res, next) {
	if(!res.locals.admin){
		res.status(401).send({ error: "Accès non authorisé." });
		return next();
	}
	//check if date exists
	if(!req.body.inputYear){
		res.status(400).send({ error : 'Le libellé de l\'édition est obligatoire.' });
		return next();
	}

	if(!req.body.inputDateStart){
		res.status(400).send({ error : 'La date de début est obligatoire.' });
		return next();
	}

	if(!req.body.inputDateEnd){
		res.status(400).send({ error : 'La date de fin est obligatoire.' });
		return next();
	}

	if(req.body.inputDateStart > req.body.inputDateEnd){
		res.status(400).send({ error : 'La date de fin doit être supérieure à la date de début.' });
		return next();
	}

	// check if id festival exists
	Festival.findById(req.body.idFestival)
	.exec(function(err, festival){
		if(!festival){
			res.status(400).send({ error : 'Le festival n\'est pas connu.' });
			return next();
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
					res.status(400).send({ error: "L'édition n'a pu être sauvegardée." });
					return next();
				}else{
					// Save the festival
					festival.editions.push(edition);
					// If edition in use
					console.log(req.body.inputInUse);
					if(req.body.inputInUse){
						festival.editionInUse = edition;
					}
					festival.save();
					res.status(201).send();
					return;
				}
			});
		}
	});
});

/* GET delete an edition */
routerEdition.get('/supprimer/:id', function(req, res, next) {
	if(!res.locals.admin){
		res.status(401).send({ error: "Accès non authorisé." });
		return next();
	}

	Edition.findById(req.params.id, function(err, edition){
		if(err || !edition){
			res.status(400).send({ error : "L'édition demandée est introuvable." });
			return next();
		}
		edition.remove(function(err, next){
			res.status(201).send();
			return;
		})
	});
});

module.exports = routerEdition;