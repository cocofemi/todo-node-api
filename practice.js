
//Inserting into a record in mongodb
db.collection('Users').insertOne({
	name: femi,
	age: 25,
	location: lagos
}, (err, result) => {
	if(err) {
		return console.log('Unable to find database');
	}
	console.log(JSON.stringify(results.ops, undefined, 2));
});


//Fecthing data from mongodb 
db.collection('Users').find({
	name: 'Femi'}).toArray().then((docs) => {
	console.log('Users');
	console.log(JSON.stringify(docs, undefined, 2));
}, (err) => {
	console.log('Unable to fetch data');
});


//delete a record from the collection in mongodb
db.collection('Users').deleteMany({name: 'Femi'}).then((result) => {
	console.log(result);
});

db.collection('Users').findOneAndDelete({_id: new ObjectID('5b47f88ec6a34c1bfca3bd78')}).then((result) => {
	console.log(JSON.stringify(result, undefined, 2)
});

//update a record from the collection in mongodb
db.collection('Users').findOneAndUpdate({_id: new ObjectID('5b47f88ec6a34c1bfca3bd78'}, {
	$set: {
		name: 'John'
	}
}, 
	$inc: {
		age: 1
	}, {
		returnOriginal: false
	}).then((result) => {
	console.log(result)
})

//Mongoose

//saving data in mongoose
var newTodo = new Todo({
	text: 'Eating Lunch',
	completed: true,
	completedAt: 34523
});

newTodo.save().then((docs) => {
	console.log('Saved todos', docs);
}, (e) => {
	console.log('Unable to save data');
});


//Creating a new model Mongoose
var User = mongoose.model('User', {
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	}
});

//create new document in mongodb
var newUser = new User({
	email: 'ogundayo@yahoo.com'
});

//call save with a promise to mongodb database
newUser.save().then((doc) => {
	console.log('New user', doc);
});


//Testing a resource Point-- POST TODOS
it('should not create todo with invalid data', (done) => {
	request(app)// a call to supertest
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if (err) {
				return done(err);
			};

			Todo.find().then((todos) => {
				expect(todos.length).toBe(0);
				done()
			}).catch((e) => done(e));
		});
});

//Query users model using findById
User.findById(id).then((user) => {
	if(!user) {
		return console.log(User not found)
	}

	console.log('User by id', user);
}).catch((e) => {
	console.log('User not found', e);
});


// Return a single todo passing unique id as a parameter
app.get('/todos/:id', (req, res) => {
	var id = req.params.id; //getting param id passed in the url

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	};
		Todo.findById(id).then((todo) => {
			if (!todo) {
				return res.status(404).send();
		};
			res.status(200).send({todo})
	}).catch((e) => {
		res.status(404).send(); // Catch whatever error comes back from an inavlid id
	});
});


describe = ('GET /todos/:id', () => {
	it('Should return a 404 if todo not found', (done) => {
		var hexId = new ObjectID.toHexString(); // converts the object Id to a string 

		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			end(done);
	});

	it('Should return 404 for non-object ids', (done) => {
		request(app);
			.get('todos/123')
			.expect(404)
			end(done);
	});	
});


//deleting a document in mongodo using mongoose(same as finding a document by id above)
app.delete('/todos/:id', (req, res) => {

	var id = req.params.id;

	//Checking if objectId is valid before runnning the remove function
	if (!ObjectID.isValid(id)) {
		return res.status(404).send(); //returns a 404 with no data
	};

	Todo.findOneAndRemove(id).then((todo) => {
		if (!todo) { // checks if no todo or document is found
			res.status(404).send();
		};
			res.send({todo}); // returns a success when todo is found( todo: todo(ES6 syntax when object name and property name are same use just the name i.e todo))
	}).catch((e) => { // catch any errors that might occur
		res.status(404).send();
	});
	
});

it('should remove a todo', (done) => {
	var hexId = todos[1]._id.toHexString();

	request(app);
		.delete(`todos/${hexId}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toBe(hexId)
		});
		end((err, res) => {
			if (err) {
				return done(err);
			}
			Todo.findById(hexId).then((Todo) => {
				expect(todo).toNotExist();
				done()
			}).catch((e) => done(e)); 
		});

});

it('it should update the todo', (done) => {
	var text = 'Eating Lunch right now';
	var completed = true;
	var hexId = todos[0]._id.toHexString(); //Grab id of the first todo

	request(app)
		.patch(`todos/${hexId}`) //patch request to update to the url
		.send({text, completed}) //send updated items to the database
		.expect(200)    //expect a sucess 200
		.expect((res) => { //custom assertion
			expect(res.body.todo.text).toBe(text) 
			expect(res.body.todo.completed).toBe(completed)
			expect(res.body.todo.completedAt).toBeA('number')
		});
		end(done);
});

it('should clear completedAt when todo is not completed', (done) => {
	var text = 'Eating Dinner right now';
	var completed = false;
	var hexId = todos[1]._id.toHexString();

	request(app)
		.patch(`todos/${hexId}`)
		.send({text, completed})
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(text)
			expect(res.body.todo.completed).toBe(completed)
			expect(res.body.todo.completedAt).toNotExist()
		});
		end(done);

});

app.post('/users', (req, res) => {

	var body = _.pick(req.body, ['email', 'password']); // pick is a lodash library method that picks out properties from the defined model

	var user = new User(body);

	user.save().then((user) => {
		res.send(user)
	}).catch((e) => {
		res.status(400).send(e);
	});
});


var femi = {
	eyes: {
		brown,
		lush,
		grey
	},
	ear: medium,
	legs: long
}
