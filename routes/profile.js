const express = require('express');
const profileRoutes = express.Router();
// const User = require('../models/user');
// const Author = require('../models/author');
// const uploadCloud = require('../middlewares/cloudinary.js');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');

profileRoutes.get('/profile', ensureLoggedIn(), (req, res) => {
  res.render('profile/myProfile');
});

profileRoutes.get('/edit-profile', ensureLoggedIn(), (req, res) => {
  res.render('profile/editProfile');
});


module.exports = profileRoutes;