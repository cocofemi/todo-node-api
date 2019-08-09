//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017',(err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}

	var db = client.db('TodoApp');

	/**db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID('5b492d2b8a1eab9427792762')
	}, {
		$set: {
			completed: true
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});**/

	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('5b4806dd04dfd91aa0e9fd40')
	}, {
		$set: {
			name: 'Nicoline'
		},
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});
});