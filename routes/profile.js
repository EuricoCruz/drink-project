const express = require('express');
const profileRoutes = express.Router();
const User = require('../models/user');
// const uploadCloud = require('../middlewares/cloudinary.js');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
const {uploadCloud, uploadCloudUser} = require('../public/config/cloudinary');

profileRoutes.get('/profile', ensureLoggedIn(), (req, res) => {
  const user = req.user;
  res.render('profile/myProfile', {user})
});

profileRoutes.get('/edit-profile', ensureLoggedIn(), (req, res) => {
  const user = req.user

  res.render('profile/editProfile', {user});
});

profileRoutes.post('/profile/editProfile/:userId', uploadCloudUser.single('photo'), ensureLoggedIn(), (req, res) => {
  const userId = req.params.userId;
  const photo = req.file.secure_url;
  console.log("qualquer coisa vai aí", req.file)
  const {name, email, age, city, profession, phone} = req.body;
  User.update({_id: userId}, {$set: {name, email, photo, age, city, profession, phone, photo}})
  .then(user => res.redirect('/profile'))
  .catch(error => console.log(err))
})  
// router.post('/books/edit/:bookID', uploadCloud.single('image'), (req, res, next) => {
//     const { title, author, description, rating, latitude, longitude } = req.body;
  
//     const imageUrl = req.file.url;
  
//     const location = {
//       type: 'Point',
//       coordinates: [longitude, latitude]
//     };
  
//     Book.update({ _id: req.params.bookID }, { $set: { title, author, description, rating, location, imageUrl } })
//       .then((book) => {
//         res.redirect('/books/edit/' + req.params.bookID);
//       })
//       .catch((error) => {
//         console.log(error);
//       })
//   });
  
//   res.render('profile/myProfile', {user})
// }



module.exports = profileRoutes;