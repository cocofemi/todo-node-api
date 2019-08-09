require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');  
var {authenticate} = require('./middleware/authenticate');


var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
	var todo = new Todo({
	text: req.body.text,
	_creator: req.user._id
});
	todo.save().then((docs) => {
	res.send(docs);
}, (e) => {
	res.status(400).send(e);
	});

});

app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.delete('/todos/:id', authenticate, async (req, res) => {
	const id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	};
	try{
		const todo = await Todo.findOneAndRemove({
		_id:id,
		_creator:req.user._id
	});
		if (!todo) {
			return res.status(404).send();
		};

		res.send({todo});
	}catch (e) {
		res.status(400).send();
	}
});

app.patch('/todos/:id', authenticate, (req,res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	};

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	}else{
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({
		_id:id,
		_creator:req.user._id
	}, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			res.status(404).send();
		}
		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	})
});


//A post route to send new user data to the database 
app.post('/users', async (req, res) => {
	try{
		// pick is a lodash library method that picks out properties from the defined model
		const body = _.pick(req.body, ['email', 'password']);
		const user = new User(body);
		await user.save();
		const token = await user.generateAuthToken(); //generate auth token is an instance method to create a new user token 

		//x-auth creates a custom http header
		res.header('x-auth', token).send(user); //http header returns the generated token
	}catch (e) {
		res.status(400).send(e);
	}
});

//Public route without authenticate middleware.
app.post('/users/login', async (req, res) => {
	try{
		const body = _.pick(req.body, ['email', 'password']); //picks off the body sent in the request
		const user = await User.findByCredentials(body.email, body.password); //checks if user exists 
		const token = await user.generateAuthToken(); //generates new user token from generateAuthToken() method in User.js
		res.header('x-auth', token).send(user); //sets the user with a new header taking also the token and returning the user
	}catch (e) {
		res.status(400).send();
	}
});

//private route with authenticate middleware.
app.delete('/users/me/token', authenticate, async (req, res) => { 
	try{
		await req.user.removeToken(req.token);
		res.status(200).send();
	}catch (e) {
		res.status(400).send();
	}
});

//private route with authenticate middleware. returns an authenticated user object(id and email)
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user); //returns the user object;
});

app.listen(port, () => {
	console.log(`Started up at port ${port}`);
});

module.exports = {app};