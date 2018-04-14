//importing module
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//initialize application
const app = express();

//Map global promise
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
})
  //callback for the promise
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

//load idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}
));
app.set('view engine', 'handlebars');

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'))

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome1';
  res.render('index', {
    title: title
  });
});

//About Route
app.get('/about', (req, res) => {
  res.render('about');
});

//idea index page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas 
      });
    })
})

//add ideas form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
})

//edit ideas form
app.get('/ideas/edit/:id', (req, res) => {
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
app.post('/ideas', (req, res) => {
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
        res.redirect('/ideas');
      })
  }
})

//edit form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //update idea
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      res.redirect('/ideas');
    })
  })
})

//port for app to listen
const port = 5000;

//set app to listen, and set a callback
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});