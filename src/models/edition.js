var mongoose = require('mongoose');

var editionSchema = mongoose.Schema({
	year: { type: String, required: true },
	date: { 
		start: Date,
		end: Date,
	}
});


var Edition = mongoose.model('Edition', editionSchema);

module.exports = Edition;