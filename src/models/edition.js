var mongoose = require('mongoose'), Schema = mongoose.Schema

var editionSchema = Schema({
	festival: { type: Schema.Types.ObjectId, ref: 'Festival' }, 
	year: { type: String, required: true },
	date: { 
		start: Date,
		end: Date,
	},
	rumors: [{ type: Schema.Types.ObjectId, ref: 'Rumor' }]
});


var Edition = mongoose.model('Edition', editionSchema);

module.exports = Edition;