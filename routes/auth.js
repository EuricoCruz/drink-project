const express = require("express");
const authRoutes = express.Router();
const drinksRoutes = express.Router();
const passport = require('passport');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Drinks = require('../models/drinks');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
// const nodemailer = require('nodemailer');

// User model
// const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcryptSalt = 10;

//signin routes
authRoutes.get("/signup", ensureLoggedOut(), (req, res, next) => {
 res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const {username, password, email, age, role} = req.body;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if(username === '' || password === '' || email === '' || age === '') {
    res.render("auth/signup", ensureLoggOut(), { message: "You need to fulfill all the fields" });
    return;
  }

  if(age < 18) {
    res.render("auth/signup", { message: "You need to be at least 18 years old to be part of our comunnity" });
    return;
  }
  
  User.findOne({username})
    .then(user => {
      if(user !==  null) {
        res.render("auth/signup", { message: "The username already exist"})
        return; 
    }
  })
  
  User.create({username, password: hashPass, email, age, role})
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
});

authRoutes.get("/login", ensureLoggedOut(), (req, res, next) => {
  res.render("auth/login");
 });

 authRoutes.post("/login", passport.authenticate("local-login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// drinksRoutes.get("/drinks", ensureLoggedIn(), (req, res, next) => {
//   Drinks.find()
// }
 
authRoutes.get("/logout", ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/login");
 });

module.exports = authRoutes;