var mongoose=require('mongoose');
var bcrypt=require('bcrypt');
var connectString="mongodb://triiplana:changeit@ds045734.mongolab.com:45734/heroku_cw0230rd";
mongoose.connect(connectString);

//User schema
var UserSchema=mongoose.Schema({
	username:{
		type:String,
		index:true	
	},
	password:{
		type:String, required: true, bcrypt:true	
	},
	email:{
		type:String
	},
	profileimage:{
		type:String
	}
});

var User= module.exports= mongoose.model('User', UserSchema);

module.exports.getUserByUsername= function(username, callback){
	var query={username:username};
	User.findOne(query, callback);
}

module.exports.getUserById= function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword= function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err)  return callback(err);
		callback(null, isMatch);
	});
}

module.exports.createUser = function(newUser, callback) {
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		//Set hashed pw
		newUser.password=hash;
		//Create User
		newUser.save(callback);
	});
}
