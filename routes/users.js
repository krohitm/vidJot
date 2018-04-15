const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//const passport = require('passport')
const router = express.Router();

//load user model
require('../models/User');
const User = mongoose.model('users');

//user login route
router.get('/login', (req, res) => {
  res.render('users/login');
})

//user register route
router.get('/register', (req, res) => {
  res.render('users/register');
})

//Register from POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' })
  }
  if (req.body.password.length < 8) {
    errors.push({ text: 'Password must be at least 8 characters' })
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  }
  else {
    //check if user already exists
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'An account already exists wth this email.');
          res.redirect('/users/register');
        }
        else {
          //save new idea to DB
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          }
          //encrypt password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              new User(newUser)
                .save()
                .then(user => {
                  req.flash('success_msg', 'You have registered successfully and can login now');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                })
            })
          });
        }
      })
  }
})

module.exports = router;