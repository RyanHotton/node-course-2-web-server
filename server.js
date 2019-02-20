const fs = require('fs');
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
// for udemy course purposes only: high security vulnerability is known
const hbs = require('hbs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs')

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });

  next();
});

// // Maintenance middleware
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));
try {
  app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
} catch (e) {
  console.log(JSON.stringify(e, undefined, 2));
}

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// root page
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'About Page',
    welcomeMessage: 'Welcome to my website'
  });
});

// about page
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

// projects page
app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page'
  });
});

// bad page
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
