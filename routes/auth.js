const express = require("express");
const authRoutes = express.Router();
const passport = require('passport');
const User = require("../models/user");
const bcrypt = require("bcrypt");
// const nodemailer = require('nodemailer');

// User model
// const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcryptSalt = 10;

//signin routes
authRoutes.get("/signup", (req, res, next) => {
 res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const age = req.body.age;
  const role = req.body.role;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if(username === '' || password === '' || email === '' || age === '') {
    res.render("auth/signup", { message: "You need to fulfill all the fields" });
    return;
  }

  if()
  
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

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
 });
 

module.exports = authRoutes