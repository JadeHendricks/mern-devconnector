const express = require('express');
const app = express();
const port = 5000;
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./db');

const auth = require('./routes/api/auth');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const post = require('./routes/api/post');

//Connect to DB
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

//Routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/post', post);


app.listen(port, () => console.log(`Server running on port:${port}`))