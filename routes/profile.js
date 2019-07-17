const express = require('express');
const profileRoutes = express.Router();
const User = require('../models/user');
const Drinks = require('../models/drinks');
// const uploadCloud = require('../middlewares/cloudinary.js');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
const {uploadCloud, uploadCloudUser} = require('../public/config/cloudinary');

profileRoutes.get('/', ensureLoggedIn(), (req, res) => {
  const user = req.user;
  Drinks.find({owner: user._id})
  .then(drink => {
  res.render('profile/myProfile', {user, drink})
  })
  .catch(err => console.log(err))
});

profileRoutes.get('/edit-profile', ensureLoggedIn(), (req, res) => {
  const user = req.user
  res.render('profile/editProfile', {user});
});

//edit
profileRoutes.post('/editProfile/:userId', uploadCloudUser.single('photo'), ensureLoggedIn(), (req, res) => {
  const userId = req.params.userId;
  const photo = req.file.secure_url;
  const {name, email, age, city, profession, phone} = req.body;
  User.update({_id: userId}, {$set: {name, email, photo, age, city, profession, phone, photo}})
  .then(user => res.redirect('/profile'))
  .catch(err => console.log(err))
})  
profileRoutes.get('/delete/:userId', ensureLoggedIn(), (req, res) => {
  console.log('profile delete')
  const userId = req.params.userId
  User.deleteOne({_id: userId})
  .then(res.redirect('/'))
  .catch(err => console.log(err))
})



module.exports = profileRoutes;