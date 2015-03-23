var mongoose = require('mongoose'), Schema = mongoose.Schema

var artistSchema = Schema({
	name: { type: String, required: true},
	img: String,
	website: String,
	facebook: String,
	instagram: String,
	twitter: String,
	rumors: [{ type: Schema.Types.ObjectId, ref: 'Rumor' }]
});


var Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;