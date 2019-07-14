const express = require('express');
const router = express.Router();
// const User = require('../models/user');
// const Author = require('../models/author');
const ensureLogin = require('connect-ensure-login');
// const uploadCloud = require('../middlewares/cloudinary.js');

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
