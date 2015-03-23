var mongoose = require('mongoose'), Schema = mongoose.Schema

var festivalSchema = Schema({
	name: { type: String, required: true },
	location: { 
		city: String,
		country: String
	},
	website: String,
	editionInUse:  { type: Schema.Types.ObjectId, ref: 'Edition' },
	editions : [{ type: Schema.Types.ObjectId, ref: 'Edition' }]
});

festivalSchema.statics.findByIdFestival = function (idFestival) {
	console.log("findByIdFestival -- Début méthode");
	return new Promise(function (resolve, reject) {
		Festival.findById(idFestival)
		.exec(function(err, festival){
			if(err || !festival){
				console.log("findByIdFestival -- Fin méthode");
				reject(new Error("Le festival n'est pas connu."))
			}else{
				console.log("findByIdFestival -- Fin méthode");
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

		festival.save(function(err, festival){
			if(err || !festival){
				console.log("addEdition -- Reject -- Fin méthode");
				reject(new Error("L'édition n'a pas pu être rajoutée au festival."))
			}else{
				console.log("addEdition -- Resolve -- Fin méthode");
				resolve(festival);
			}
		});
	});
};

var Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;