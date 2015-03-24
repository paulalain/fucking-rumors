var mongoose = require('mongoose'), Schema = mongoose.Schema
var Sequences = require('./sequences');

var sequence_name = 'seq_rumor';

var rumorSchema = Schema({
	_id: Number,
	artist: { type: Number, ref: 'Artist' }, 
	edition: { type: Number, ref: 'Edition' },
	pourcentage: String,
	date: Date,
	source: [{ type: String}],
	official: Boolean
});

// Generate id
rumorSchema.pre('save', function (next) {
	var rumor = this;

	if(!rumor._id){
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
						rumor._id = 1;
						next();
					}
				});
			}else{
				rumor._id = sequence.seq - 1;
				next();
			}
		});
	}else{
		next();
	}
	
});

var Rumor = mongoose.model('Rumor', rumorSchema);

module.exports = Rumor;