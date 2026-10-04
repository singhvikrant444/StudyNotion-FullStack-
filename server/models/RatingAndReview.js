const mongoose = require('mongoose');

const ratingAndReview = new mongoose.Schema({
   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   },
   rating:{
    type:Number,
    required:true,
    },
    review:{
        type:String,
    },
});

module.exports = mongoose.model('RatingAndReview', ratingAndReview);
