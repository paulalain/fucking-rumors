var mongoose = require('mongoose'), Schema = mongoose.Schema
var Sequences = require('./sequences');

var sequence_name = 'seq_editions';

var editionSchema = Schema({
	_id: Number,
	festival: { type: Number, ref: 'Festival' }, 
	year: { type: String, required: true },
	date: { 
		start: Date,
		end: Date,
	},
	rumors: [{ type: Number, ref: 'Rumor' }]
});

// Generate id
editionSchema.pre('save', function (next) {
	var edition = this;

	if(!edition._id){
		Sequences.findByIdAndUpdate(sequence_name, { $inc: { seq: 1 } }, function (err, sequence) {
			if (err){
				next(err);
			}else if(!sequence){
				// no sequences found we create one
				var sequence = new Sequences({
					_id: sequence_name,
					seq: 1});
				sequence.save(function(err){
					if(err){
						next(err);
					}else{
						edition._id = 1;
						next();
					}
				});
			}else{
				edition._id = sequence.seq - 1;
				next();
			}
		});
	}else{
		next();
	}
	
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
				console.log(err);
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