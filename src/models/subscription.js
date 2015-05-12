var deepPopulate = require('mongoose-deep-populate');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Sequences = require('./sequences');

var sequence_name = 'seq_subscription';

var typeFestival = 0;
var typeArtist = 1;

var subscriptionSchema = Schema({
	_id: Number,
	user: {type: Number, ref: 'User' },
	festivals: [{type: Number, ref: 'Festival'}],
	artists: [{type: Number, ref: 'Artist'}]
});

//deep populate
subscriptionSchema.plugin(deepPopulate, {});

// Generate id
subscriptionSchema.pre('save', function (next) {
	var subscription = this;
	
	if(!subscription._id){
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
						subscription._id = 1;
						next();
					}
				});
			}else{
				subscription._id = sequence.seq - 1;
				next();
			}
		});
	}else{
		next();
	}
});

subscriptionSchema.statics.getSubscriptionByIdUser = function (idUser) {
	console.log("getSubscriptionByIdUser -- Début méthode -- ");

	return new Promise(function (resolve, reject) {
		Subscription.find({ user: idUser })
		.exec(function(err, subscription){
			if(err || !subscription || subscription.length == 0){
				Subscription.createSubscription(idUser)
				.then(function(subscription){
					console.log("getSubscriptionByIdUser -- Resolve 1 -- Fin méthode");
					resolve(subscription);
				})
				.catch(function(err){
					console.log("getSubscriptionByIdUser -- Reject -- Fin méthode");
					reject(new Error(err.message));
				});
			}else{
				console.log("getSubscriptionByIdUser -- Resolve 2 -- Fin méthode");
				resolve(subscription[0]);
			}
		});
	});
};

subscriptionSchema.statics.createSubscription = function(idUser){
	console.log("createSubscription -- Début méthode");

	var subscription = new Subscription({
		user: idUser
	});

	return new Promise(function (resolve, reject) {
		subscription.save(function (err, subscription) {
			if (err) {
				console.log("createSubscription -- Erreur -- Fin méthode");
				console.log(err);
				reject(new Error(err.message));
			}else{
				console.log("createSubscription -- Fin méthode");
				resolve(subscription);
			}
		});
	});
}

subscriptionSchema.statics.addFestivalSubscription = function(idUser, idFestival){
	console.log("addFestivalSubscription -- Début méthode");

	return new Promise(function (resolve, reject) {
		Subscription.getSubscriptionByIdUser(idUser)
		.then(function(subscription){
			if(subscription){
				subscription.festivals.push(idFestival);
				subscription.save(function (err, subscription) {
					if (err) {
						console.log("addFestivalSubscription -- Erreur -- Fin méthode");
						console.log(err);
						reject(new Error(err.message));
					}else{
						console.log("addFestivalSubscription -- Fin méthode");
						resolve(subscription);
					}
				});
			}else{
				reject(new Error("Impossible de créer un abonnement."));
			}
		})
		.catch(function(err){
			reject(new Error("Erreur technique, impossible de créer un abonnement."));
		});
	});
}

subscriptionSchema.statics.addArtistSubscription = function(idUser, idArtist){
	console.log("addArtistSubscription -- Début méthode");

	return new Promise(function (resolve, reject) {
		Subscription.getSubscriptionByIdUser(idUser)
		.then(function(subscription){
			if(subscription){
				subscription.artists.push(idArtist);
				
				subscription.save(function (err, subscription) {
					console.log("test5");
					if (err) {
						console.log("addArtistSubscription -- Erreur -- Fin méthode");
						console.log(err);
						reject(new Error(err.message));
					}else{
						console.log("addArtistSubscription -- Fin méthode");
						resolve(subscription);
					}
				});
			}else{
				reject(new Error("Impossible de créer un abonnement."));
			}
		})
		.catch(function(err){
			console.log(err);
			reject(new Error("Erreur technique, impossible de créer un abonnement."));
		});
	});
}

subscriptionSchema.statics.deleteFestivalSubscription = function(idUser, idFestival){
	console.log("deleteFestivalSubscription -- Début méthode");
	
	return new Promise(function (resolve, reject) {
		Subscription.getSubscriptionByIdUser(idUser)
		.then(function(subscription){
				Subscription.update({ _id : subscription._id}, 
										{ $pull: { festivals: idFestival } },
										{ multi: true }).exec();
				console.log("deleteFestivalSubscription -- Fin méthode");
				resolve(subscription);	
		})
		.catch(function(err){
			reject(new Error("Aucun abonnement pour cet utilisateur."))
		});
	});
}

subscriptionSchema.statics.deleteArtistSubscription = function(idUser, idArtist){
	console.log("deleteArtistSubscription -- Début méthode");
	
	return new Promise(function (resolve, reject) {
		Subscription.getSubscriptionByIdUser(idUser)
		.then(function(subscription){
				Subscription.update({ _id : subscription._id}, 
										{ $pull: { artists: idArtist } },
										{ multi: true }).exec();
				console.log("deleteArtistSubscription -- Fin méthode");
				resolve(subscription);	
		})
		.catch(function(err){
			console.log(err);
			reject(new Error("Aucun abonnement pour cet utilisateur."))
		});
	});
}

var Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;