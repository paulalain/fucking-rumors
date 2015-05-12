var deepPopulate = require('mongoose-deep-populate');
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
	editionInUse:  { type: Number, ref: 'Edition', default: null},
	editions : [{ type: Number, ref: 'Edition' }]
});

//deep populate
festivalSchema.plugin(deepPopulate, {});

// remove festival, so remove all editions
festivalSchema.pre('remove', function (next) {
	console.log("Remove festival -- Pre remove -- Début");
	console.log("Remove festival -- " + this._id);
	
	var Edition = require('./edition');

	// remove edition from festival
	Edition.find({ festival: this._id }, function(err, editions){
		if(err || !editions){
			console.log("Remove festival -- Pre remove -- Error on find editions");
		}else{
			// iterate on editions (must be have one)
			for(var i=0; i < editions.length; i++){
				editions[i].remove();
			}
		}
	});

	var Subscription = require('./subscription');

	// remove subscriptions
	Subscription.find({ festivals: this._id }, function(err, subscriptions){
		if(err || !subscriptions){
			console.log("Remove subscription -- Pre remove -- Error on find subscriptions");
		}else{
			// iterate on subscriptions (must be have one)
			for(var i=0; i < subscriptions.length; i++){
				Subscription.update({ _id: subscriptions[i]._id },
					{ $pull: { festivals: this._id } }, 
 					{ multi: true }).exec();
			}
		}
	});

	next();
    console.log("Remove festival -- Pre remove -- Fin");
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
		  location:{
		  	city: inputCity,
		  	country: inputCountry
		  },
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

festivalSchema.statics.updateFestival = function (idFestival, inputName, inputCity, inputCountry, inputWebSite, inputFacebook, 
	inputInstagram, inputTwitter) {
	console.log("updateFestival -- Début méthode");
	
	return new Promise(function (resolve, reject) {
		Festival.findByIdFestival(idFestival)
				.then(function(festival){
					festival.name = inputName;
					festival.location = { city: inputCity, country: inputCountry};
					festival.website = inputWebSite;
					festival.facebook = inputFacebook;
					festival.instagram = inputInstagram;
					festival.twitter = inputTwitter;

					festival.save(function (err, festival) {
						if (err) {
							console.log("updateFestival -- Erreur -- Fin méthode");
							console.log(err);
							reject(new Error(err.message));
						}else{
							console.log("updateFestival -- Fin méthode");
							resolve(festival);
						}
					});
				}).catch(function(err){
					console.log("updateFestival --  Erreur -- Reject");
						reject(err);
				});
		
	});
};

var Festival = mongoose.model('Festival', festivalSchema);
module.exports = Festival;