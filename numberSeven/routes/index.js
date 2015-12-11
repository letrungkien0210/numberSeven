var express = require('express');
var router = express.Router();
/*For Users router*/
var User = require('../models/User.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
 

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/*Users*/
router.get('/register', function (req, res, next) {
  res.render('register', {
    'title': 'Register'
  });
});

router.get('/login', function (req, res, next) {
  res.render('login', {
    'title': 'Register'
  });
});

router.post('/register', function (req, res, next) {
  //Get Form values
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var passwordConfirm = req.body.passwordconfirm;
  
  //Form Validation
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is invalid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('passwordConfirm', 'Password do not match').equals(req.body.password);
  
  //Check for errors
  var errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
      email: email,
      username: username,
      password: password,
      password2: passwordConfirm
    });
  } else {
    var newUser = ({
      email: email,
      username: username,
      password: password
    });
     
    //Create User
    User.createUser(newUser, function (err, user) {
      if (err) throw err;
      console.log(user);
    });
     
    //Success Message
    req.flash('success', 'You are now registered and may log in');

    res.location('/');
    res.redirect('/');
  }
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done){
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        console.log('Unknown User');
        return done(null, false, {message: 'Unknown User'});
      }
      
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else{
          console.log('Invalid password');
          return done(null, false,{message:'Invalid Password'});
        }
      });
    });
  }
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid username or password'}), function(req, res){
  console.log('Authentication Successful');
  req.flash('success','You are logged in');
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/users/login');
});

module.exports = router;
