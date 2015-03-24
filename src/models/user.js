var mongoose = require('mongoose'), Schema = mongoose.Schema
var Sequences = require('./sequences');

var sequence_name = 'seq_user';

// var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = Schema({
	_id: Number,
	signupDate: { type: Date, default: Date.now },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	website: String,
	instagram: String,
	facebook: String,
	twitter: String,
	location: { 
		city: String,
		country: String
	}
});

userSchema.pre('save', function (next) {
	var user = this;

	if(!user._id){
		//generate id
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
						user._id = 1;
						next();
					}
				});
			}else{
				user._id = sequence.seq - 1;
				next();
			}
		});
	}else{
		next();
	}
	

	// if (!user.isModified('password')) return next();

	// bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
	// 	if (err) return next(err);

	// 	bcrypt.hash(user.password, salt, function (err, hash) {
	// 		if (err) return next(err);
	// 		user.password = hash;
	// 		next();
	// 	});
	// });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
	isMatch = (this.password == candidatePassword);
	cb(null, isMatch);
	// bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
	// 	if (err) return cb(err);
	// 	cb(null, isMatch);
	// });
};

userSchema.statics.checkIfUserExists = function(username) {
	console.log("checkIfUserExists -- Début méthode");
	return new Promise(function (resolve, reject) {
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				console.log("checkIfUserExists -- Reject -- Fin méthode");
				console.log(err);
				reject(err);
			} else if (user) {
				console.log("checkIfUserExists -- Reject -- Fin méthode");
				reject(new Error("L'utilisateur existe déjà."));
			} else {
				console.log("checkIfUserExists -- Resolve -- Fin méthode");
				resolve(user);
			}
		});
	});
};

userSchema.statics.checkIfMailExists = function(email) {
	console.log("checkIfMailExists -- Début méthode");
	return new Promise(function (resolve, reject) {
		User.findOne({ email: email }, function (err, user) {
			if (err) {
				console.log("checkIfMailExists -- Reject -- Fin méthode");
				console.log(err);
				reject(err);
			} else if (user) {
				console.log("checkIfMailExists -- Reject -- Fin méthode");
				reject(new Error("Le mail renseigné existe déjà."));
			} else {
				console.log("checkIfMailExists -- Resolve -- Fin méthode");
				resolve(user);
			}
		});
	});
};

userSchema.statics.createUser = function(username, email, password) {
	console.log("createUser -- Début méthode");
	return new Promise(function (resolve, reject) {
		var newUser = new User({ username: username, email: email, password: password });
		newUser.save(function (err) {
			if (err) {
				console.log("createUser -- Reject -- Fin méthode");
				console.log(err);
				reject(err);
			} else {
				console.log("createUser -- Resolve -- Fin méthode");
				resolve(newUser);
			}
		});
	});
};

userSchema.statics.checkIfValidUser = function(username, password) {
	console.log("checkIfValidUser -- Début méthode");
	return new Promise(function (resolve, reject) {
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				console.log("checkIfValidUser -- Reject -- Fin méthode");
				reject(err);
			} else if (user) {
				user.comparePassword(password, function (err, isMatch) {
					if (err){
						return done(err);
					}
					if (isMatch) {
						console.log("checkIfValidUser -- Resolve -- Fin méthode");
						resolve(user);
					} else {
						console.log("checkIfValidUser -- Reject -- Fin méthode");
						reject(new Error("Le mot de passe saisi est invalide."));
					}
				});
			} else {
				console.log("checkIfValidUser -- Reject -- Fin méthode");
				reject(new Error("Utilisateur inconnu."));
			}
		});

	});
};

userSchema.statics.checkFieldsSignup = function(username, password, passwordConfirmation){
	console.log("checkFieldsSignup -- Début méthode");
	return new Promise(function (resolve, reject) {
		if((!username || !(username.length > 4))){
			console.log("checkFieldsSignup -- Reject -- Fin méthode");
			reject(new Error("Le pseudo doit faire au minimum 5 caractères."));
		}else{
			if(/[^a-zA-Z0-9]/.test(username)){
				console.log("checkFieldsSignup -- Reject -- Fin méthode");
				reject(new Error("Le pseudo doit être en alpha-numérique."));
			}else{
				// check if password is securized
				if(!password || !(password.length > 7)){
					console.log("checkFieldsSignup -- Reject -- Fin méthode");
					reject(new Error("Le mot de passe saisi est trop court."));
				}else{
					//check if passwords are the same
					if(password != passwordConfirmation){
						console.log("checkFieldsSignup -- Reject -- Fin méthode");
						reject(new Error("Les deux mots de passes saisis sont différents."));
					}else{
						console.log("checkFieldsSignup -- Resolve -- Fin méthode");
						resolve(null);
					}
				}
			}
		}
	});
}

var User = mongoose.model('User', userSchema);

module.exports = User;