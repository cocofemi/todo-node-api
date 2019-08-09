const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'demola12';

// bcrypt.genSalt(10, (err, salt) => {
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

var hashedPassword = '$2a$10$zRIX2xWhR8OtVzL6CbbEAeJn7LurdUWTtyKohw7ZY/hoaaBB7MEfy'

bcrypt.compare('123!', hashedPassword, (err, res) => {
	console.log(res);
})

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);
// // var message = 'I am number 3';
// // var hash = SHA256(message);

// // console.log(`Message: ${message}`);
// // console.log(`Hash: ${hash}`);

// // var data = {
// // 	id: 4
// // };

// // var token = {
// // 	data,
// // 	hash: SHA256(JSON.stringify(data) + 'some secret').toString()
// // };

// // token.data.id = 5;

// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// // var resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString()

// // if (resultHash === token.hash) {
// // 	console.log('Data was not changed');
// // }else{
// // 	console.log('Data was changed do not use');
// // }