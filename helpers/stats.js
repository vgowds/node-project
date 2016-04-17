var models = require('../models'),
	async = require('async');


module.exports = function(callback) {

	async.parallel([

		function(next){
			
			//images count
			models.Image.count({}, next);
			//next(null, 0);
		},
		function(next){
			//comments count
			models.Comment.count({}, next);
			//next(null, 0);
		},
		function(next){
			//views
			
			models.Image.aggregate({$group : { _id : '1', viewsTotal: { $sum : '$views'}}}, 
				function(err, result){
					var viewsTotal = 0;
					//console.log('result.length ' + result.length);
					if (result.length > 0){
						viewsTotal += result[0].viewsTotal;
					}
					next(null, viewsTotal);
				});
			
			//next(null, 0);	
		},
		function(next){
			//images
			
			models.Image.aggregate({$group: { _id : '1', likesTotal : {$sum : '$likes' } } },
				function(err, result){
					var likesTotal = 0;
					if (result.length > 0){
						likesTotal += result[0].likesTotal; 
					}
					next(null, likesTotal);
				});
				
				//next(null, 0);
		}

		], function(err, results){

		if (err ){ throw err; }
		callback(null, {
			images: results[0],
			comments: results[1],
			views: results[2],
			likes: results[3]
		});

	});

}

