const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { signUpUser, logInUser, readUserProfile, readAllProfile } = require('../controller/userController');

router.post('/signUp', signUpUser );

router.post('/login', logInUser);

router.get('/me',auth, readUserProfile);

router.get('/all', readAllProfile);

 
module.exports = router;
   