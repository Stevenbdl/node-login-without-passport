const express = require('express');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const path = require('path');
const flash = require('connect-flash');

//init database connection and configs
require('./database');
app.engine('ejs', ejsMate);

//settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
//app.use(express.json())//This is for get JSON for (insomnia client) or another REST CLIENT
app.use(logger('dev'));
app.use(cookieParser('30122001'));
app.use(session({
  secret: '30122001',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
  app.locals.success_msg = req.flash('success_msg');
  app.locals.error_msg = req.flash('error_msg');
  app.locals.user = req.session.user;
  next();//this is like (break) in loops
});

//routes
app.use('/', require('./routes/index'));

module.exports = app;