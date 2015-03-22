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


var Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;