var mongo = require("./mongo");
var mongoURL = "mongodb://apps92:shim123@ds155727.mlab.com:55727/airbnbproto";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('../Models/user');
var newAvgRating = 1;

var SubmitReviewAndRating = function(req, res)
{
	console.log("inside submit review");
	
	//review and ratings inserted
	Users.update({"email":req.body.review.email}, {$push : {Reviews : {ratings : req.body.review.Reviews.ratings, feedback : req.body.review.Reviews.feedback, user_id : req.session.user.emailId} } } , function(err, user){
		//needs req.session.user.emailId for testing
		
		if (user) 
		{
			console.log("success");
			RetriveAverageRating(req, res);
			
		} else 
		{
			console.log(err);
		}
		
	})


var RetriveAverageRating = function(req,res)
{
		//average rating retrieved
		Users.findOne({"email":req.body.review.email},function(err,user){
			
			if (user) 
			{
				newAvgRating = ((user.avgrating + req.body.review.Reviews.ratings)/(user.Reviews.length));
				UpdateAverageRating(req, res, newAvgRating);
				console.log("avg rating "+user.avgrating);
				console.log("no of reviews "+user.Reviews.length);
				console.log("New rating "+newAvgRating);
				
			} else 
			{
				console.log(err);
			}
		})
}
	

var UpdateAverageRating = function(req, res, newAvgRating)
{
	console.log("here "+newAvgRating);
	
	Users.update({email:req.body.review.email}, {$set : {avgrating : newAvgRating }}, function(err, user){
		if (user) 
		{
			res.status(200);
			res.json({"result":"Rating changed"});
		} else 
		{
			console.log(err);
		}
		
	})
}
	
	
}

var GetReviews = function(req, res)
{
	//find all reviews
	Users.findOne({"email":req.body.review.email},function(err,user){
		
		if (user) 
		{
			var json_response = {avgrating:user.avgrating, reviews : user.Reviews};
			res.send(json_response);
			
		} else 
		{
			console.log(err);
		}
	})
}


exports.SubmitReviewAndRating = SubmitReviewAndRating;
exports.GetReviews = GetReviews;