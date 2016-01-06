var express = require('express');

/*For Users router*/
var User = require('../models/User.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

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
    'title': 'Login'
  });
});

router.post('/register', function (req, res, next) {
  if(!req.body) return res.sendStatus(400);
  
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
  req.checkBody('passwordconfirm', 'Password do not match').equals(password);
  
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
    var newUser =new User({
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

router.post('/login', 
      passport.authenticate('local',{failureRedirect:'/login',failureFlash:'Invalid username or password'}), 
      function(req, res){
  console.log('Authentication Successful');
  req.flash('success','You are logged in');
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

router.get('/addplace', function(req, res){
  res.render('addplace',{
    'title':'Add place'
  });
})

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next;
  }
  res.redirect("/login");
}

module.exports = router;
