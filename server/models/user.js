const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//Instance methods are based on each individually created/saved (user) document.
//Model methods are custom methods based on the(User) model.

//Creates a new user model to store user data
var UserSchema = new mongoose.Schema({ //The userschema helps us to create and use custom model and instance methods i.e findByToken, generateAuthToken
	email:{
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: { //checks if the email format sent to the server is correct 
			validator:validator.isEmail,
			message: '{value} is not a valid email'
		}
	},

	password:{
		type: String,
		required: true,
		minlength: 6
	},

	tokens: [{  // tokens takes an array object-- this is created each time the user logs into the application.
		access: { //They are given a unique access auth token
			type: String,
			required:true
		},
		token:{
			type: String,
			required: true
		}
	}]
});

//toJSON method ovverides the generateAuthToken method and selects properties to display leaving off sensitive info i.e password, tokens
UserSchema.methods.toJSON = function () { //arrow functions do not bind this keyword
	var user = this; //this keyword refers to the UserSchema Object model above and can access its properties and manipulate them in this method(function)
	var userObject = user.toObject(); // toObject(converts the user variable to an object)

	return _.pick(userObject, ['_id', 'email']); // selecting properties to display from the user object
};

//Instance method generateAuthToken for each individual user login
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';  //access and token variable are created for tokens property in user model.

  //jwt.sign method takes two arguments (an object --- the user id and the access property) and (the secret key)
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  //calls the array method push to update the tokens array in user model
  user.tokens.push({access, token});

  return user.save().then(() => { //returns a promise so we can chain another promise to it
    return token; //returns the token in order for it to be used in the success case(chained promise above)
  });
};

UserSchema.methods.removeToken = function (token) {
	var user = this;
	return user.update({
		$pull:{ // pull is a mongodb methdd that removes an item from an array that meets a certain condition.
			tokens:{token} //check if token passed in the argument matches the one in the database.
		}
	})
};

//Model method created to find user token 
//.statics is like calling .methods although used for model methods and not instance
UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded; //undefined var defination because of the error thrown by jwt.verify

	try{
		decoded = jwt.verify(token, process.env.JWT_SECRET); //verifys that the token hasn't been manipulated and its correct.
	}catch(e) {
		// new Promise((resolve, reject) => { //same as the shorter form below
		// 	reject()
		// });
		return Promise.reject(); //if any error occurs the success case below does not run.  
	}
	// we return the query here in order to chain a then callback in findByToken
	return User.findOne({ //if the token is decoded successfully we query to find any user in the database.
		'_id': decoded._id,
		'tokens.token': token, //Where tokens.token equals token passed as argument
		'tokens.access': 'auth'// we use quotes to access nested object properties in the user model.
	});
};

//Model method to check the if a user exists in the database
UserSchema.statics.findByCredentials = function (email, password) {
	var User = this;

	return User.findOne({email}).then((user) => {  // return a promise and finds if the user email exists 
		if (!user) {
			return Promise.reject(); // return a rejected promise if no user is found
		}

	return new Promise((resolve, reject) => { // success case if the user was found. A new promise is used here because bcrypt doesn't support promises
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user); //resolves with a user in order to use it in the express route(/users/login)
				}else{
					reject();
				}
			});
		});
	});
};

//using Pre which is a mongoose middleware that runs before saving a model to the database
UserSchema.pre('save', function(next){ //pre takes two arguments(the event(save) callback function)
	var user = this; //this keyword stores the individual document(user) 

	if (user.isModified('password')) {// checks if the user password has changed if true the plain text password is hashed
		bcrypt.genSalt(10, (err, salt) => { //bcrypt takes two arguements the amount of rounds to generate the salt
			bcrypt.hash(user.password, salt, (err, hash) => {//hashes the password along with the salt(above) 
				user.password = hash;  //sets the user password to the hash value
				next();//call to next to complete the middleware and save the document
			});
		});
	}else{
		next();
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};  //Export call to use in other file