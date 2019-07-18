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
const User = require('./models/user');
const Drinks = require('./models/drinks');
const hbs = require('hbs');
const nodemailer = require('nodemailer')
const GoogleStrategy = require("passport-google-oauth20").Strategy;




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
hbs.registerPartials(__dirname + '/views/partials');

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


passport.use('local-login', new LocalStrategy(
{passReqToCallback: true},
(req, username, password, next) => {
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
   return next(null, user);
 });
}));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_KEY,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);

      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }
          
          const username = profile.name.givenName;
          const name = profile.displayName;
          const photo = profile.photos[0].value;
          let token = '';
          const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          for(let i = 0; i < 25; i++) {
          token += characters[Math.floor(Math.random() * characters.length )];
          }
          const confirmationCode = token;
          User.create({ googleID: profile.id, username, photo, name, confirmationCode})
            .then(newUser => {
              // const photo =  
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

const indexRoutes = require('./routes/index')
app.use('/', indexRoutes);

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes);

const profileRoutes = require('./routes/profile')
app.use('/profile', profileRoutes);

const drinksRoutes = require('./routes/drinks')  
app.use('/drinks', drinksRoutes);

app.listen(process.env.PORT, () => console.log(`server is running on port ${process.env.PORT}`));

