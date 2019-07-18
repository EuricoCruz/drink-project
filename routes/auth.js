const express = require("express");
const authRoutes = express.Router();
const drinksRoutes = express.Router();
const passport = require('passport');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Drinks = require('../models/drinks');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
const cloudinaryStorage = require('multer-storage-cloudinary');
const {uploadCloud, uploadCloudUser} = require('../public/config/cloudinary');
const multer = require('multer')
const nodemailer = require('nodemailer');

// User model
// const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcryptSalt = 10;

//signin routes
authRoutes.get("/signup", ensureLoggedOut(), (req, res, next) => {
 res.render("auth/signup");
});

authRoutes.post("/signup", uploadCloudUser.single('photo'), (req, res, next) => {
  const {username, password, email, age, role} = req.body;
  const photo = req.file.secure_url;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
  token += characters[Math.floor(Math.random() * characters.length )];
  }
  const confirmationCode = token;

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
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  })

  User.create({username, password: hashPass, email, age, role, photo, confirmationCode})
  .then(() => { 
    transporter.sendMail({
      from: '"DrinkBuddy Managers 👻" <drinkbuddy@admin.com>',
      to: email,
      subject: 'Welcome to DrinkBuddy! Please confirm your account.',
      text: `Hi, there!
      Welcome to Servo-Service, the premier service for services!
      http://localhost:9999/auth/confirm/${confirmationCode}`,
      html: `<a href="http://localhost:9999/auth/confirm/${confirmationCode}">here</a> to confirm your account.</p>`,
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err))
  })
  .catch(error => {
    console.log(error);
  })
})

authRoutes.get("/login", ensureLoggedOut(), (req, res, next) => {
  res.render("auth/login");
 });

 authRoutes.post("/login", passport.authenticate("local-login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/auth/google", ensureLoggedOut(), passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/plus.profile.emails.read",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/profile.agerange.read",
      
    ]
  })
);
authRoutes.get("/auth/google/callback",ensureLoggedOut(), passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/login" // here you would redirect to the login page using traditional login approach
  })
);

// drinksRoutes.get("/drinks", ensureLoggedIn(), (req, res, next) => {
//   Drinks.find()
// }
 
authRoutes.get("/auth/logout", ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/login");
 });

module.exports = authRoutes;