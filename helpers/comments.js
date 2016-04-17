var models = require('../models'),
    async = require('async');

module.exports = {
    newest: function(callback) {
        models.Comment.find({},{},{ limit: 5, sort: {'timestamp': -1}}, function(err, comments){

            //console.log(comments.length);
            //get respective image for each comment
            var attachImage = function(comment, next){ //next is callback for daisy chain
              models.Image.findOne({_id: comment.image_id}, function(err, image){
                  if (err) { throw err;}
                  //console.log(comment);
                  comment.image = image
                  next(err);
              });
            };

            async.each(comments, attachImage, function(err) {
              if (err) throw err;

              callback(err,comments)
            });

        });

    }
};