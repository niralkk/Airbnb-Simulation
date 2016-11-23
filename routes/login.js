var mongo = require("./mongo");
var mongoURL = "mongodb://apps92:shim123@ds155727.mlab.com:55727/airbnbproto";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('../Models/user');
var bcrypt = require('bcryptjs');
var uniqueIDGenerator = require('../routes/uniqueIDGenerator');
var passport = require('passport');
require('./passport')(passport);
var LocalStrategy = require('passport-local').Strategy;

var userSignup = function(req,res){
	console.log("Inside signup user");
	req.body.user.user_id = uniqueIDGenerator.returnUniqueID();
	req.body.user.user_status = "active";
	var salt = bcrypt.genSaltSync(10); //encryption
	if(typeof req.body.user.password !== "undefined"){
		var hash = bcrypt.hashSync(req.body.user.password, salt); //encryption	
	}
	if(req.body.user.password == null || req.body.user.firstname == null 
			|| req.body.user.email == null ){
		res.json({"result":"These fields cannot be null"});
		return;
	} else{
		req.body.user.password = hash;	
	}
	Users.find({"email":req.body.user.email},function(err,user){
		console.log("found");
		console.log(user);
		
		if(user.length > 0){
			res.status(400);
			res.json({"result":"user already present"});
			return;
		}

		var user = new Users(req.body.user);
		user.save(function(err,result){
				if(!err){
					console.log(result);
					res.status(200);
					res.json({"result":"user LoggedIn"});
					return;
				}
				else{
					console.log("inside error");
					console.log(err);
					return;
				}
					
			});
		

	})
	
	
};
/*passport.use('user',new LocalStrategy({
    usernameField: 'email'
},
function(username, password, done) {
  console.log("I am checking here"+username);
  console.log("I am checking password"+password);
  Users.findOne({ email: username }, function (err, user) {
  if (err) { return done(err); }
  if (!user) {
	  console.log("Wrong Email");
    return done(null, false, { message: 'Incorrect email.' });
  }		      
  console.log(user);
  var hash = user.password;
	console.log(hash);
    if(!bcrypt.compareSync(password, hash)){
    	console.log("Wrong password");
    	return done(null, false, { message: 'Incorrect password.' });
    }
    console.log("Correct password");
  
  return done(null, user);
});
}
));*/


var authenticateLocal = function (req,res,next){

	console.log("inside Passport signin register");

	passport.authenticate('user',function(err,user,info){
	if(err) {
      return next(err);
    }
    if(!user) {
      return res.redirect('/');
    }
    req.logIn(user, {session:false}, function(err) {
      if(err) {
        return next(err);
      }
      console.log(user);
      console.log("storing in session");
	 //console.log("Testing for user",res);
	     var userObject = {
	     	"emailId": user.email,
	     	"UserType": user.UserType,
	     	"user_id":user.user_id
	     }
	 	req.session.user = userObject;
	 	//console.log(req.session.emailId);
		res.json({"userLoggedIn":true});
		return;
		 //return res.redirect('/');
	});
	
})(req, res, next);
};


/*
var userLogIn = function(req,res){
	console.log("Inside user sign in");
	

	Users.findOne({"email":req.body.UserLogin.email},function(err,user){
 		if(err || user == null){
 			console.log("user not found");
 			res
 			.status(404)
 			.send({"result":"user not found"});
 			return;
 		}
 				
 
      var hash = user.password;
 		console.log(hash);
      if(bcrypt.compareSync(req.body.UserLogin.password, hash)){
      	console.log("successful login");
      	req.session.email = user.email;
      	req.session.username = user.firstname;
      	res
  		.status(200)
  		.send({"result":"user Logged in"});
  		return;
      } else{
    	  res
    		.status(400)
    		.send({"result":"Wrong Password"});
      }
 })
	
};
*/
var deleteLogin = function(req,res){
	Users.update({"email":req.body.user.email}, {$set : {user_status : "inactive" }}, function(err, removed){	
		console.log(removed);
		if(err || removed == null){
			res
			.status(400)
			.send({"result":"Bad Request"});
			return;
		}
		
		res
		.status(200)
		.send({"result":"User Deleted"});
	} );
 	};



var updateLogin = function(req,res){
	console.log("Inside user Update");
	var query = {'email':req.body.UpdateLogin.email};
	Users.findOneAndUpdate(query, req.body.UpdateLogin, {upsert:false}, function(err, doc){
		
	    if (err) {
	    	res
			.status(400)
			.send({"result":"Bad request"});
			return;
	    }
	res
 	.status(200)
 	.send({"result":"User Updated"});
		res
		.status(200)
		.send({"result":"User Updated"});
	});
};

var getLoginUserDetails = function(req,res){
	console.log("Inside Get user");
	
 	
 	Users.findOne({"email":req.query.email},function(err,user){
 		if(err || user == null){
 			res
 			.status(404)
 			.send({"result":"user not found"});
 			return;
 			
 		}
 		res
 		.status(200)
 		.send({"result":user});
 	});
	
};

var getUserProfile = function(req,res){
	console.log("Inside Get LoggedIn user service");
	 	
 	Users.findOne({"email":req.session.user.emailId},function(err,user){
 		if(err || user == null){
 			res
 			.status(404)
 			.send({"result":"user not found"});
 			return;
 			
 		}

 		var UserObject = 
 		{
		 	"firstname": user.firstname,
		    "lastname": user.lastname,
		    "email": user.email,
		    "user_id": user.user_id,
		    "type": user.type,
		    "UserType": user.UserType
 		};
 				
 		res
 		.status(200)
 		.send({"LoggedIn User":UserObject});
 	});
	
};


exports.getUserProfile = getUserProfile;
exports.userSignup = userSignup;
//exports.userLogIn = userLogIn;
exports.deleteUser = deleteLogin;
exports.updateUser = updateLogin;
exports.getLoginUserDetails = getLoginUserDetails;
exports.authenticateLocal = authenticateLocal;

