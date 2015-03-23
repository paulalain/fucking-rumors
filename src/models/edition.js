var mongoose = require('mongoose'), Schema = mongoose.Schema

var editionSchema = Schema({
	festival: { type: Schema.Types.ObjectId, ref: 'Festival' }, 
	year: { type: String, required: true },
	date: { 
		start: Date,
		end: Date,
	},
	rumors: [{ type: Schema.Types.ObjectId, ref: 'Rumor' }]
});

editionSchema.statics.checkEditionValues = function (inputYear, inputDateStart, inputDateEnd) {
	console.log("checkEditionValues -- Début méthode");
	return new Promise(function (resolve, reject) {
		if(!inputYear){
			console.log("checkEditionValues -- Reject -- Fin méthode");
			reject(new Error("Le libellé de l'édition est obligatoire."));
		}else{
			if(!inputDateStart){
			console.log("checkEditionValues -- Reject -- Fin méthode");
			reject(new Error("La date de début est obligatoire."));
			}else{
				if(!inputDateEnd){
					console.log("checkEditionValues -- Reject -- Fin méthode");
					reject(new Error("La date de fin est obligatoire."));
				}else{
					if(inputDateStart > inputDateEnd){
					console.log("checkEditionValues -- Reject -- Fin méthode");
					reject(new Error("La date de fin doit être supérieure à la date de début."));
					}else{
						console.log("checkEditionValues -- Resolve -- Fin méthode");
						resolve(null);
					}
				}
			}
		}
	});
};

editionSchema.statics.createEdition = function(festival, inputYear, inputDateStart, inputDateEnd) {
	console.log("createEdition -- Début méthode");
	return new Promise(function (resolve, reject) {

		var edition = new Edition({
				  festival : festival._id,
				  year: inputYear,
				  date: { 
				  	start : inputDateStart,
				  	end: inputDateEnd 
				  }
				});

		edition.save(function (err) {
			if (err) {
				console.log("createEdition -- Reject -- Fin méthode");
				reject(err);
			} else {
				console.log("createEdition -- Resolve -- Fin méthode");
				resolve(edition);
			}
		});
	});
};

var Edition = mongoose.model('Edition', editionSchema);

module.exports = Edition;