require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connected!'))
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
  });

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.get('/submit', (req, res) => {
	res.render('submit');
});

app.post('/register', (req, res) => {

	bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
		const newUser = new User({
    	    email: req.body.username,
	        password: hash
        });
	
	    newUser.save((err) => {
	    	if (err) {
	    		console.log(err);
	    	} else {
	    		res.render('secrets');
	    	}
	    });
    });
});

app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	User.findOne({email: username}, (err, userFound) => {
		if (err) {
			console.log(err);
		} else {
			if (userFound) {
				bcrypt.compare(password, userFound.password, (err, result) => {
					if (result === true) {
						res.render('secrets');
					}
                });				
			}
		}
	});
});


app.listen(3000, () => {
	console.log("Server is running on port 3000");
});