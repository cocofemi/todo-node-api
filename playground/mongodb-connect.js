//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017',(err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}

	var db = client.db('TodoApp');
	console.log('Connected to MongoDB server');

	/**db.collection('Todos').insertOne({
		text: 'Something to do',
		completed: false
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert todo', err);
		}
		console.log(JSON.stringify(result.ops, undefined, 2))
		client.close();
	});*/
	
	db.collection('Users').insertOne({
		name: 'Femi',
		age: 24,
		location: 'London'
	}, (err, result) => {
		if (err) {
			return console.log('Unable to insert Users', err);
		}
		console.log(result.ops[0]._id.getTimestamp())
		client.close();
	});

	
});