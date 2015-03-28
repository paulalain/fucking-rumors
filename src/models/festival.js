var mongoose = require('mongoose'), Schema = mongoose.Schema
var Sequences = require('./sequences');

var sequence_name = 'seq_festival';

var festivalSchema = Schema({
	_id: Number,
	name: { type: String, required: true },
	location: { 
		city: String,
		country: String
	},
	website: String,
	facebook: String,
	twitter: String,
	instagram: String,
	editionInUse:  { type: Number, ref: 'Edition' },
	editions : [{ type: Number, ref: 'Edition' }]
});

// Generate id
festivalSchema.pre('save', function (next) {
	var festival = this;
	if(!festival._id){
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
						festival._id = 1;
						next();
					}
				});
			}else{
				festival._id = sequence.seq - 1;
				next();
			}
		});
	}else{
		next();
	}
});

festivalSchema.statics.findByIdFestival = function (idFestival) {
	console.log("findByIdFestival -- Début méthode");

	return new Promise(function (resolve, reject) {
		Festival.findById(idFestival)
		.exec(function(err, festival){
			if(err || !festival){
				console.log("findByIdFestival -- Reject -- Fin méthode");
				console.log(err);
				reject(new Error("Le festival n'est pas connu."))
			}else{
				console.log("findByIdFestival -- Resolve -- Fin méthode");
				resolve(festival);
			}
		});
	});
};

festivalSchema.statics.addEdition = function (festival, edition, inputInUse) {
	console.log("addEdition -- Début méthode");

	return new Promise(function (resolve, reject) {
		console.log(festival);
		console.log(edition);
		festival.editions.push(edition._id);

		// If edition in use
		if(inputInUse){
			festival.editionInUse = edition._id;
		}

		festival.save(function(err){
			if(err){
				console.log("addEdition -- Reject -- Fin méthode");
				console.log(err);
				reject(new Error("L'édition n'a pu être rajoutée au festival."))
			}else{
				console.log("addEdition -- Resolve -- Fin méthode");
				resolve(festival);
			}
		});
	});
};

festivalSchema.statics.createFestival = function (inputName, inputCity, inputCountry, inputWebSite, inputFacebook, 
	inputInstagram, inputTwitter) {
	console.log("createFestival -- Début méthode");
	
	return new Promise(function (resolve, reject) {
		var festival = new Festival({
		  name: inputName,
		  city: inputCity,
		  country: inputCountry,
		  website: inputWebSite,
		  facebook: inputFacebook,
		  twitter: inputTwitter,
		  instagram: inputInstagram
		});

		festival.save(function (err, festival) {
			if (err) {
				console.log("createFestival -- Erreur -- Fin méthode");
				console.log(err);
				reject(new Error(err.message));
			}else{
				console.log("createFestival -- Fin méthode");
				resolve(festival);
			}
		});
	});
};

var Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;