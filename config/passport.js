const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const brcypt = require('bcryptjs');

//load user model
const User = mongoose.model('users');

module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email,
    password, done) => {
    User.findOne({ email: email })
      .then(user => {
        //check if user exists
        if (!user) {
          return done(null, false, { message: 'User does not exist' });
        }

        //match password if user found
        brcypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          }
          else {
            return done(null, false, { message: 'Incorrect email/password used' });
          }
        })
      })
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}