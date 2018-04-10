//importing module
const express = require('express');
const exphbs = require('express-handlebars');

//initialize application
const app = express();

//Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'}
));
app.set('view engine','handlebars');

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

//port for app to listen
const port = 5000;

//set app to listen, and set a callback
app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});