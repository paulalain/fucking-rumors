var deepPopulate = require('mongoose-deep-populate');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
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

//deep populate
artistSchema.plugin(deepPopulate, {});

artistSchema.pre('remove', function (next) {
	console.log("Remove artist -- Pre remove -- Début");
	console.log("Remove artist -- " + this._id);
	
	var Rumor = require('./rumor');

	// remove rumors linked to this artist
	Rumor.find( { artist: this._id }, function(err, rumors){
		if(err || !rumors){
			console.log("Remove edition -- Pre remove -- Error on find rumors");
		}else{
			// iterate on rumors (must be have one)
			for(var i=0; i < rumors.length; i++){
				rumors[i].remove();
			}
		}
	});

	// remove subscriptions
	Subscription.find({ festivals: this._id }, function(err, subscriptions){
		if(err || !editions){
			console.log("Remove subscription -- Pre remove -- Error on find subscriptions");
		}else{
			// iterate on editions (must be have one)
			for(var i=0; i < subscriptions.length; i++){
				Subscription.update({ _id: subscriptions[i]._id },
					{ $pull: { artists: this._id } }, 
 					{ multi: true }).exec();
			}
		}
	});

	next();
    console.log("Remove artist -- Pre remove -- Fin");
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

artistSchema.statics.findByIdArtist = function (idArtist) {
	console.log("findByIdArtist -- Début méthode");

	return new Promise(function (resolve, reject) {
		Artist.findById(idArtist)
		.exec(function(err, artist){
			if(err || !artist){
				console.log("findByIdArtist -- Reject -- Fin méthode");
				console.log(err);
				reject(new Error("L'artiste n'est pas connu."))
			}else{
				console.log("findByIdArtist -- Resolve -- Fin méthode");
				resolve(artist);
			}
		});
	});
};

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
	var img = (img || "http://a1.mzstatic.com/eu/r30/Purple3/v4/19/07/b5/1907b5f3-ef53-97d1-04d4-1109a477f451/icon100x100.jpeg");

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