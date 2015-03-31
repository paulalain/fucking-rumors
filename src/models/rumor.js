var mongoose = require('mongoose'), Schema = mongoose.Schema
var Sequences = require('./sequences');

var sequence_name = 'seq_rumor';

var rumorSchema = Schema({
	_id: Number,
	artist: { type: Number, ref: 'Artist', required: true }, 
	edition: { type: Number, ref: 'Edition', required: true },
	rumors: [{
		percentage: String,
		date: Date,
		sources: { type: String }
	}],
	official: {type: Boolean, required: true }
});

// Generate id
rumorSchema.pre('save', function (next) {
	var rumor = this;

	if(!rumor._id){
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
						rumor._id = 1;
						next();
					}
				});
			}else{
				rumor._id = sequence.seq - 1;
				next();
			}
		});
	}else{
		next();
	}
});

rumorSchema.statics.checkArtistAlreadyRumoredOnEdition = function (artist, edition) {
	console.log("checkArtistAlreadyRumoredOnEdition -- Début méthode");

	return new Promise(function (resolve, reject) {
		if(!artist || !edition){
			console.log("checkArtistAlreadyRumoredOnEdition -- Reject -- Fin méthode");
			reject(new Error("Artiste et édition sont obligatoires."));
		}else{
			Rumor.findOne({ artist : artist, edition: edition }, function(err, rumor){
				if(!rumor){
					console.log("checkArtistAlreadyRumoredOnEdition -- Resolve -- Fin méthode");
					resolve(null);
				}else{
					console.log("checkArtistAlreadyRumoredOnEdition -- Reject -- Fin méthode");
					reject(new Error("L'artiste a déjà une rumeur sur cette édition."));
				}
			});
		}
	});
};

rumorSchema.statics.createRumor = function (artist, edition, rumors, official) {
	console.log("createRumor -- Début méthode");

	return new Promise(function (resolve, reject) {
		var rumor = new Rumor({
					artist: artist,
					edition: edition,
					rumors: rumors,
					official: official
				});

		rumor.save(function (err, rumor) {
			if (err) {
				console.log("createRumor -- Erreur -- Fin méthode");
				console.log(err);
				reject(new Error(err.message));
			}else{
				console.log("createRumor -- Fin méthode");
				resolve(rumor);
			}
		});
	});
};

var Rumor = mongoose.model('Rumor', rumorSchema);

module.exports = Rumor;