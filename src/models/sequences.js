var mongoose = require('mongoose'), Schema = mongoose.Schema

var sequencesSchema = new Schema({
	_id: String,
	seq: { type: Number, default: 1 }
});

var Sequences = mongoose.model('Sequences', sequencesSchema);

module.exports = Sequences;