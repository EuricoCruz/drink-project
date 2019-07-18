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


drinksRoutes.get('/add-drink', (req, res) => {
  res.render('drinks/addDrinks', {user: req.user});
});

drinksRoutes.post('/drinkAdd', uploadCloud.single('photo'), ensureLoggedIn(), (req, res) => {
  const user = req.user;
  const photo = req.file.secure_url;
  const {name, recipe, ingredients, type, owner} = req.body;
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
drinksRoutes.get('/add-drink', (req, res) => {
  res.render('drinks/addDrinks');
});



//Params routes

drinksRoutes.get('/drink/:id', ensureLoggedIn(), (req, res) => {
  const drinkId = req.params.id;
  const user = req.user;
  Drinks.findById(drinkId)
  .then(drink => res.render('drinks/drink', { drink, user }))
  .catch(err => console.log(err))
});

drinksRoutes.get('/edit-drink/:id', (req, res) => {
  const drinkId = req.params.id
  Drinks.findById(drinkId)
  .then(drink => res.render('drinks/editDrinks', {drink}))
  .catch(err => console.log(err))
});

//update drink
drinksRoutes.post('/save-edit/:drinkId', uploadCloudUser.single('photo'), ensureLoggedIn(), (req, res) => {
  const drinkId= req.params.drinkId;
  const photo = req.file.secure_url;
  const {name, ingredients, recipe, type} = req.body;

  Drinks.update({_id: drinkId}, {$set: {name, ingredients, photo, recipe, type }})
  .then(drink => {
    res.redirect(`/drinks/drink/${drinkId}`)
  })
  .catch(err => console.log(err))
})  


//delete
drinksRoutes.get('/delete/:id', ensureLoggedIn(), (req, res) => {
  const id = req.params.id
  Drinks.deleteOne({_id: id})
  .then(res.redirect('/'))
  .catch(err => console.log(err))
})

module.exports = drinksRoutes;