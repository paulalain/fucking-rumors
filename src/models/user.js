var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = mongoose.Schema({
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
    next();
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
	return new Promise(function (resolve, reject) {
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				reject(err);
			} else if (user) {
				reject(new Error("L'utilisateur existe déjà."));
			} else {
				resolve(user);
			}
		});
	});
};

userSchema.statics.checkIfMailExists = function(email) {
	return new Promise(function (resolve, reject) {
		User.findOne({ email: email }, function (err, user) {
			if (err) {
				reject(err);
			} else if (user) {
				reject(new Error("Le mail renseigné existe déjà."));
			} else {
				resolve(user);
			}
		});
	});
};

userSchema.statics.createUser = function(username, email, password) {
	return new Promise(function (resolve, reject) {
		console.log(username);
		console.log(password);
		var newUser = new User({ username: username, email: email, password: password });
		newUser.save(function (err) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve(newUser);
			}
		});
	});
};

userSchema.statics.checkIfValidUser = function(username, password) {
	return new Promise(function (resolve, reject) {
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				reject(err);
			} else if (user) {
				user.comparePassword(password, function (err, isMatch) {
					if (err) return done(err);
					if (isMatch) {
						resolve(user);
					} else {
						reject('Le mot de passe saisi est invalide.');
					}
				});
			} else {
				reject('Utilisateur inconnu.');
			}
		});

	});
};

var User = mongoose.model('User', userSchema);

module.exports = User;