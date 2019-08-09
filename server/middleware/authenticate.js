var {User}  = require('./../models/user');

//middleware function to authenticate user's token 
var authenticate = (req, res, next) => {
	var token = req.header('x-auth'); //gets the token from the http header 

	User.findByToken(token).then((user) => { //custom model method(findByToken) takes a token element and returns a user object
		if (!user) {
			return Promise.reject(); // If no user is found the promise is rejected 
		}
		req.user = user; //sets the req.user to the user found
		req.token = token;//sets the req.token to the token found
		next(); //tells the end of the middleware function so the async function can continue to run 
	}).catch((e) => { //catches any error returned from the promise call
		res.status(401).send();
	});
};

module.exports = {authenticate}; //exports the authenticate function