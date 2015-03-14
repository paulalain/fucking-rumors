var mongoose = require('mongoose');

var festivalSchema = mongoose.Schema({
	name: { type: String, required: true },
	location: { 
		city: String,
		country: String
	},
	website: String
});


var Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;