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
	console.log("Route /editions/ajouterEdition -- Début");

	//check if the user is admin
	if(!res.locals.admin){
		res.status(401).send({ error: "Accès non authorisé." });
		return next();
	}

	var idFestival = req.body.idFestival;
	var inputYear = req.body.inputYear;
	var inputDateStart = req.body.inputDateStart;
	var inputDateEnd = req.body.inputDateEnd;
	var inputInUse = req.body.inputInUse;

	Edition.checkEditionValues(inputYear, inputDateStart, inputDateEnd)
		.then(Festival.findByIdFestival.bind(null, idFestival))
		.then(function(festival){
			Edition.createEdition(festival, inputYear, inputDateStart, inputDateEnd)
			.then(function (edition) {
				Festival.addEdition(festival, edition, inputInUse)
					.then(function(festival){
						console.log("Route /editions/ajouterEdition -- Fin");
						res.status(201).send();
					})
					.catch(function (err) {
						console.log("Route /editions/ajouterEdition -- Catch 1");
						console.log("Erreur : " + err);
						res.status(400).send({ error: err.message });
			});
			}).catch(function (err) {
				console.log("Route /editions/ajouterEdition -- Catch 2");
				console.log("Erreur : " + err);
				res.status(400).send({ error: err.message });
			});
		})
		.catch(function (err) {
			console.log("Route /editions/ajouterEdition -- Catch 3");
			console.log("Erreur : " + err);
			res.status(400).send({ error: err.message });
		});
});

/* GET delete an edition */
routerEdition.get('/supprimer/:id', function(req, res, next) {
	console.log("Route /editions/supprimer/id -- Début");

	if(!res.locals.admin){
		res.status(401).send({ error: "Accès non authorisé." });
		return next();
	}

	Edition.findById(req.params.id, function(err, edition){
		if(err || !edition){
			console.log("Route /editions/supprimer/id -- Erreur -- Fin");
			res.status(400).send({ error : "L'édition demandée est introuvable." });
			return next();
		}
		edition.remove(function(err, next){
			console.log("Route /editions/supprimer/id -- Fin");
			res.status(201).send();
			return;
		})
	});
});

module.exports = routerEdition;