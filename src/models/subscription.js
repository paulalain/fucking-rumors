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
	festivals: [{
		id: {type: Number, ref: 'Festival'},
		percentageMin: Number,
		official: Boolean
	}],
	artists: [{
		id: {type: Number, ref: 'Artist'},
		percentageMin: Number,
		official: Boolean
	}]
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
	console.log("getSubscriptionByIdUser -- Début méthode");

	return new Promise(function (resolve, reject) {
		Subscription.find({ user: idUser })
		.exec(function(err, festival){
			if(err || !festival){
				console.log("getSubscriptionByIdUser -- Reject -- Fin méthode");
				console.log(err);
				reject(new Error("L'abonnement n'est pas connu."))
			}else{
				console.log("getSubscriptionByIdUser -- Resolve -- Fin méthode");
				resolve(festival);
			}
		});
	});
};

subscriptionSchema.statics.createSubscription = function(idUser){
	var subscription = new Subscription({
		  user: idUser
		});

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
}

subscriptionSchema.statics.addModifyFestivalSubscription = function(idUser, idFestival, percentage, official){
	console.log("addFestivalSubscription -- Début méthode");

	//TODO
	Subscription.getSubscriptionByIdUser(idUser)
	.then(function(subscription){
			console.log("Route /festival/modifier  -- Fin");
			res.status(201).send();
		})
		.catch(function(err){
			console.log("Route /festival/modifier/ --  Erreur -- Fin");
				res.status(400).send({ error: err.message });
		});

	// check if subscriptions exist for the user
	// else create one
}

subscriptionSchema.statics.addModifyArtistSubscription = function(idUser, idArtist, percentage, official){
	console.log("addFestivalSubscription -- Début méthode");

	//TODO
}

subscriptionSchema.statics.deleteFestivalSubscription = function(idUser, idFestival){
	console.log("deleteFestivalSubscription -- Début méthode");
	
	return new Promise(function (resolve, reject) {
		Subscription.getSubscriptionByIdUser(idUser)
		.then(function(subscription){
				Subscription.update({ _id : subscription._id}, 
										{ $pull: { festivals: { id: idFestival } } },
										{ multi: true }).exec();
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
										{ $pull: { artists: { id: idFestival } } },
										{ multi: true }).exec();
				resolve(subscription);	
		})
		.catch(function(err){
			reject(new Error("Aucun abonnement pour cet utilisateur."))
		});
	});
}

var Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;