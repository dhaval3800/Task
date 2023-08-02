const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/user');
const postRoutes = require('./src/routes/post');

const User = require('./src/models/user');
const Post = require('./src/models/post');
const  dotenv = require('dotenv');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use('/users', userRoutes); 
app.use('/posts', postRoutes);
 

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});


