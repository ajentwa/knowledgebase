const LocalStrategy = require('passport-local').Strategy;
const user = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    // Match username
    let query = {username:username};
    user.findOne(query, function(err, user){
      if(err) throw err;
      if(!user) {
        return done(null, false, {message: 'No User found'})
      }

      // Match password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Wrong password'})
        }
      });
    });
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    user.findById(id, function(err, user){
      done(err, user);
    });
  });
}
