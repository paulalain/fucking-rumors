var mongoose = require('mongoose'), Schema = mongoose.Schema

var rumorSchema = Schema({
	artist: { type: Schema.Types.ObjectId, ref: 'Artist' }, 
	edition: { type: Schema.Types.ObjectId, ref: 'Edition' },
	pourcentage: String,
	date: Date,
	source: [{ type: String}],
	official: Boolean
});


var Rumor = mongoose.model('Rumor', rumorSchema);

module.exports = Rumor;