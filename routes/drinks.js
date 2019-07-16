const express = require('express');
const drinksRoutes = express.Router();
const Drinks = require('../models/drinks');
// const User = require('../models/user');
// const Author = require('../models/author');
const ensureLogin = require('connect-ensure-login');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
// const uploadCloud = require('../middlewares/cloudinary.js');

drinksRoutes.get('/', (req, res) => {
  res.render('drinks/index');
});

drinksRoutes.get('/edit-drinques', (req, res) => {
  res.render('drinks/editDrinks');
});


drinksRoutes.get('/drink/:id', ensureLoggedIn(), (req, res) => {
  const drinkId = req.params.id;
  Drinks.findById(drinkId)
  .then(drink => res.render('drinks/drink', { drink }))
  .catch(err => console.log(err))
});

module.exports = drinksRoutes;