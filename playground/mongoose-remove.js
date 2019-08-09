const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*Todo.remove({}).then((results) => {
	console.log(results);
});*/

Todo.findOneAndRemove(_id: '5b5135548a1eab942779a11b').then((doc) => {
	console.log(doc);
});

Todo.findByIdAndRemove('5b5135548a1eab942779a11b').then((doc) => {
	console.log(doc);
});