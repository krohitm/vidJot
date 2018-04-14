const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//idea index page
router.get('/', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas 
      });
    })
})

//add ideas form
router.get('/add', (req, res) => {
  res.render('ideas/add');
})

//edit ideas form
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea: idea
    });
  })
})

//process form
router.post('/', (req, res) => {
  let errors = [];

  //check if title is missing
  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  //check if details are missing
  if (!req.body.details) {
    errors.push({ text: 'Please add details' });
  }

  //re-render add ideas view if any error
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }
  else {
    //save new idea to DB
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Idea added successfully');
        res.redirect('/ideas');
      })
  }
})

//edit form process
router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //update idea
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      req.flash('success_msg', 'Idea updated successfully');
      res.redirect('/ideas');
    })
  })
})

//delete idea
router.delete('/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
  .then(() =>{
    req.flash('success_msg', 'idea successfully deleted');
    res.redirect('/ideas');
  })
})

module.exports = router;