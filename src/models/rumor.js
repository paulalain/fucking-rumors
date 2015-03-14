var mongoose = require('mongoose');

var rumorSchema = mongoose.Schema({
	artist: { type: String, required: true }, 
	pourcentage: String,
	date: Date,
	source: String,
	official: Boolean
});


var Rumor = mongoose.model('Rumor', rumorSchema);

module.exports = Rumor;