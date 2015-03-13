var express = require('express');
var router = express.Router();

var Festival = require('./models/festival');

/* GET festivals listing. */
router.get('/', function(req, res, next) {
	Festival.find(, function(err, festivals){
		if(festivals.length > 0){
			var str = '';
			for(i=0;i>festivals.length;i++){
				str += festivals.name + ' ';
			}

			res.send(str);
		}else{
			res.send('No festival yet');
		}
		
	});
	
});

module.exports = router;
