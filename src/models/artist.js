var mongoose = require('mongoose'), Schema = mongoose.Schema
var Sequences = require('./sequences');

var sequence_name = 'seq_artist';

var artistSchema = Schema({
	_id: Number,
	name: { type: String, required: true},
	img: String,
	website: String,
	facebook: String,
	instagram: String,
	twitter: String,
	rumors: [{ type: Number, ref: 'Rumor' }]
});

// Generate id
artistSchema.pre('save', function (next) {
	var artist = this;
	
	if(!artist._id){
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
						artist._id = 1;
						next();
					}
				});
			}else{
				artist._id = sequence.seq - 1;
				next();
			}
		});
	}else{
		next();
	}
});


artistSchema.statics.checkArtistValues = function (name) {
	console.log("checkArtistValues -- Début méthode");

	return new Promise(function (resolve, reject) {
		if(!name){
			console.log("checkArtistValues -- Reject -- Fin méthode");
			reject(new Error("Le nom de l'artiste est obligatoire."));
		}else{
			Artist.findOne({ name : name }, function(err, artist){
				if(!artist){
					console.log("checkArtistValues -- Resolve -- Fin méthode");
					resolve(null);
				}else{
					console.log("checkArtistValues -- Reject -- Fin méthode");
					reject(new Error("Un artiste existe déjà avec ce nom là."));
				}
			});
		}
	});
};

artistSchema.statics.addRumor = function (artist, rumor) {
	console.log("addRumor -- Début méthode");

	return new Promise(function (resolve, reject) {
		if(!rumor){
			reject(new Error("La rumeur n'existe pas."));
		}else{
			artist.rumors.push(rumor._id);

			artist.save(function(err){
				if(err){
					console.log("addRumor -- Reject -- Fin méthode");
					console.log(err);
					reject(new Error("La rumeur n'a pu être rajoutée à l'artiste."));
				}else{
					console.log("addRumor -- Resolve -- Fin méthode");
					resolve(artist);
				}
			});
		}
	});
};

artistSchema.statics.createArtist = function (name, website, facebook, instagram, twitter, img) {
	console.log("artist -- Début méthode");
	
	var name = name;
	var website = (website || "");
	var facebook = (facebook || "");
	var instagram = (instagram || "");
	var twitter = (twitter || "");
	var img = (img || "TODO DEFAULT IMAGE");

	return new Promise(function (resolve, reject) {
		var artist = new Artist({
					name: name,
					website: website,
					facebook: facebook,
					instagram: instagram,
					twitter: twitter,
					img: img
				});

		artist.save(function (err, artist) {
			if (err) {
				console.log("createArtist -- Erreur -- Fin méthode");
				console.log(err);
				reject(new Error(err.message));
			}else{
				console.log("createArtist -- Fin méthode");
				resolve(artist);
			}
		});
	});
};

var Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;