//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017',(err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}

	var db = client.db('TodoApp');
	console.log('Connected to MongoDB server');
	
	/**db.collection('Todos').find({
		_id: new ObjectID('5b47fbff8a1eab94277914d5') 
	}).toArray().then((docs) => {
		console.log('Todos');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch todos', err);
	});*/

		/**db.collection('Todos').find().count().then((count) => {
		console.log(`Todos count: ${count}`);
	}, (err) => {
		console.log('Unable to fetch todos', err);
	});*/

	db.collection('Users').find({name: 'Jemma'}).toArray().then((docs) => {
		console.log('Users');
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('Unable to fetch Users', err);
	});

});