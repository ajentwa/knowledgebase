const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User model
const User = require('../models/user');

// Register Form
router.get('/register', function(req, res, next) {
    res.render('users/register',{
      title: 'Registration Form',
      year: new Date().getFullYear()
  });
});

// Register Process
router.post('/register', function(req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.check('name', 'Name is required').notEmpty();
  req.check('email', 'Email is required').notEmpty();
  req.check('email', 'Email is not valid').isEmail();
  req.check('username', 'Username is required').notEmpty();
  req.check('username').exists().withMessage('Username already exists');
  // .genreNotExists(req.params.id).withMessage('Genre already exists');
  req.check('username', 'Username is already registered.').exists();
  req.check('password', 'Password is required').notEmpty();
  req.check('password2', 'Passwords donot match').equals(req.body.password);

  // Get errors
  let errors = req.validationErrors();

  if(errors) {
    res.render('users/register', {
      title: 'Registration Form',
      year: new Date().getFullYear(),
      errors: errors
    });
  } else {
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(req.body.password, salt, function(err, hash){
        if(err) {
        console.log(err);
        }

        let newUser = new User({
          name: name,
          email: email,
          username: username,
          password: hash
        });

        newUser.save(function(err){
          if(err) {
            console.log(err);
            return;
          }else{
            req.flash('success', 'You are now registered and can log in')
            res.redirect('/users/login');
          }
        });

      });
    });
  }
});

// Login Form
router.get('/login', function(req, res, next){
  res.render('users/login', {
    title: 'Login Form',
    year: new Date().getFullYear()
  });
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/articles',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res, next){
  req.logout();
  req.flash('success', 'You are logged out');
  res.render('users/login');
});

module.exports = router;
