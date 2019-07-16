const express = require('express');
const drinksRoutes = express.Router();
const Drinks = require('../models/drinks');
const ensureLogin = require('connect-ensure-login');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
const uploadCloud = require('../public/config/cloudinary');

drinksRoutes.get('/', (req, res) => {
  res.render('drinks/index');
});

drinksRoutes.get('/edit-drinques', (req, res) => {
  res.render('drinks/editDrinks');
});
drinksRoutes.get('/add-drink', (req, res) => {
  res.render('drinks/addDrinks');
});




drinksRoutes.get('/drink/:id', ensureLoggedIn(), (req, res) => {
  const drinkId = req.params.id;
  Drinks.findById(drinkId)
  .then(drink => res.render('drinks/drink', { drink }))
  .catch(err => console.log(err))
});

module.exports = drinksRoutes;