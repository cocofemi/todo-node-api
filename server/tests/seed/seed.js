const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'femi@example.com',
	password: 'userOnePass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id:userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}, {
	_id: userTwoId,
	email: 'seun@example.com',
	password: 'userTwoPass',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id:userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}];

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo',
	_creator: userOneId
}, {
	_id: new ObjectID(),
	text: 'Second test todo',
	completed:true,
	completedAt: 33,
	_creator: userTwoId
}];

//Removes Todos from the database for testing using remove() and also adds seed data using insertMany() 
const populateTodos = function (done) {
	 this.timeout(3000); // A very long environment setup.
		Todo.remove({}).then( function () {
			return Todo.insertMany(todos);
		}).then( function () {
			done();
		});
};

const populateUsers = function (done) {
	this.timeout(10000);
	User.remove({}).then(function() {
		var userOne = new User(users[0]).save(); //.save() here returns a promise
 		var userTwo = new User(users[1]).save();

 		return Promise.all([userOne, userTwo]); //returns a promise so we can chain another promise to the remove func(Promise.all takes an array of promises )
	}).then(function () {
	});
};
// const populateUsers = (done) => {
// 	User.remove({}).then(() => {
// 		var userOne = new User(user[0]).save();
// 		var userTwo = new User(user[1]).save();

// 		return Promise.all([userOne, userTwo])
// 	}).then(() => done());
// };

module.exports = {todos, populateTodos, users, populateUsers};