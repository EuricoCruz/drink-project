const express = require('express');
const router = express.Router();
const Drinks = require('../models/drinks');
const mongoose = require('mongoose');
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
// const uploadCloud = require('../middlewares/cloudinary.js');

router.get('/',  (req, res) => {
  Drinks.find()
  .then(drink => {
  const user = req.user
  res.render('index', { drink, user });
  console.log(drink)
  })
  .catch(err => console.log(err))
});

module.exports = router;
