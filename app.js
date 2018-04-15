//importing module
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//initialize application
const app = express();

//import routers
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//passport config
require('./config/passport')(passport);
//db config
const db = require('./config/database');

//Map global promise
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect(db.mongoURI, {
})
  //callback for the promise
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));


//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}
));
app.set('view engine', 'handlebars');

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'))

//expression session middleware
app.use(session({
  secret: 'Vidjot@123',
  resave: false,
  saveUninitialized: true
}))

//intialize passport and use persistent login sessions
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  next();
})

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

//About Route
app.get('/about', (req, res) => {
  res.render('about');
});


//use routers in app
app.use('/ideas', ideas)
app.use('/users', users)

//port for app to listen on heroku or local
const port = process.env.PORT || 5000;

//set app to listen, and set a callback
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});