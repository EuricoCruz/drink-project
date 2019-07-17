const express = require('express');
const drinksRoutes = express.Router();
const Drinks = require('../models/drinks');
const ensureLogin = require('connect-ensure-login');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
const multer = require('multer')
const {uploadCloud, uploadCloudUser} = require('../public/config/cloudinary');
drinksRoutes.get('/', (req, res) => {
  res.render('drinks/index');
});

drinksRoutes.get('/edit-drinques', (req, res) => {
  res.render('drinks/editDrinks');
});

drinksRoutes.get('/add-drink', (req, res) => {
  res.render('drinks/addDrinks', {user: req.user});
});

drinksRoutes.get('/drink/:id', ensureLoggedIn(), (req, res) => {
  const drinkId = req.params.id;
  Drinks.findById(drinkId)
  .then(drink => res.render('drinks/drink', { drink }))
  .catch(err => console.log(err))
});

drinksRoutes.post('/drinkAdd', uploadCloud.single('photo'), ensureLoggedIn(), (req, res) => {
  const user = req.user;
  const photo = req.file.secure_url;
  const {name, recipe, ingredients, type, owner} = req.body;
  console.log(name)
  Drinks.findOne({name})
    .then(name => {
      if(name !==  null) {
        res.render("drinks/addDrink", { message: "This name already exist"})
        return; 
    }
  })
  
  Drinks.create({name, recipe, ingredients, type, photo, owner})
  .then(() => {
    res.redirect("/profile");
  })
  .catch(error => {
    console.log(error);
  })
});

module.exports = drinksRoutes;