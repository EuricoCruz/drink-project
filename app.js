require('dotenv').config();
const express = require('express');
const app = express() //express init on app
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/user');
const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')

//moongose configuration
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log('connected to mongoDB');
});

//morgan config
app.use(morgan('dev'));

//hbs + path + body-parser config
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// adding flash as error handler middleware
app.use(flash());

// express session config
app.use(session({
 secret: "our-passport-local-strategy-app",
 resave: true,
 saveUninitialized: true,
 store: new MongoStore({
   mongooseConnection: mongoose.connection,
   ttl: 24 * 60 * 60 // 1 day
 })
}));

// passport config


// user serialization
passport.serializeUser((user, cb) => {
 cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
 User.findById(id, (err, user) => {
   if (err) { return cb(err); }
   cb(null, user);
 });
});


passport.use(new LocalStrategy({
 passReqToCallback: true
}, (req, username, password, next) => {
 User.findOne({ username }, (err, user) => {
   if (err) {
     return next(err);
   }
   if (!user) {
     return next(null, false, { message: "Incorrect username" });
   }
   if (!bcrypt.compareSync(password, user.password)) {
     return next(null, false, { message: "Incorrect password" });
   }
   console.log('session:', user);

   return next(null, user);
 });
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRoutes);
app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => console.log(`server is running on port ${process.env.PORT}`));

