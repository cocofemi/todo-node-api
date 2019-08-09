//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017',(err, client) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}

	var db = client.db('TodoApp');

	/**deleteMany
	console.log('Connected to MongoDB server');
	
	db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
		console.log(result);
	});*/

	/**deleteOne
	db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
		console.log(result);
	});*/

	/**findOneAndDelete
	db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
		console.log(result);
	});*/

	/*deleteManyUsers
	db.collection('Users').deleteMany({name: 'Femi'}).then((result) => {
		console.log(result);
	});*/

	//findOneAndDeleteUsers
	db.collection('Users').findOneAndDelete({_id: new ObjectID('5b47f88ec6a34c1bfca3bd78')}).then((result) => {
		console.log(result);
	});

});