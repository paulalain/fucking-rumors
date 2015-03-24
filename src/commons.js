// Middleware
var requireRole = function(role) {
  return function(req, res, next) {
  	console.log("RequireRole -- " + role + " -- Début méthode");

  	if(role == 'admin' && req.res.locals.admin){
  		console.log("RequireRole -- " + role + " -- Fin méthode");
  		next();
  	}else if(role == 'moderateur' && req.res.locals.moderateur){
  		console.log("RequireRole -- " + role + " -- Fin méthode");
  		next();
  	}else if(role == 'user' && req.res.locals.user){
  		console.log("RequireRole -- " + role + " -- Fin méthode");
  		next();
  	}else{
  		console.log("RequireRole -- " + role + " -- Non auhorisé -- Fin méthode");
  		res.status(403).send({ error: "Accès non authorisé." });
  	}
  }
};

exports.requireRole = requireRole;