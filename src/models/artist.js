var mongoose = require('mongoose'), Schema = mongoose.Schema
var Sequences = require('./sequences');

var sequence_name = 'seq_artist';

var artistSchema = Schema({
	_id: Number,
	name: { type: String, required: true},
	img: String,
	website: String,
	facebook: String,
	instagram: String,
	twitter: String,
	rumors: [{ type: Schema.Types.ObjectId, ref: 'Rumor' }]
});

// Generate id
artistSchema.pre('save', function (next) {
	var artist = this;
	
	if(!artist._id){
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
						artist._id = 1;
						next();
					}
				});
			}else{
				artist._id = sequence.seq - 1;
				next();
			}
		});
	}else{
		next();
	}
});

var Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;