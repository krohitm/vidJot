//importing module
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

//add ideas form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
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

//port for app to listen
const port = 5000;

//set app to listen, and set a callback
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});