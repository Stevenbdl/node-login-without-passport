const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

//gets
router.get('/', (req, res) => {
  res.render('Welcome', { pageTitle: 'Welcome - Page' });
});

router.get('/signup',isAuthenticated, (req = request, res = response) => {
  res.render('signup', { pageTitle: 'Sign up - Page' });
});

router.get('/login',isAuthenticated,  (req = request, res = response) => {
 // console.log('Me rediccionaron')
  res.render('login', { pageTitle: 'Log in - Page' });
});

router.get('/profile', (req = request, res = response) => {
  if(!req.session.user) res.redirect('/login');
  res.render('profile', { pageTitle: 'Profile - Page', email : req.session.user.email || null });  
});

//posts
router.post('/signup', (req = request, res = response) => {
  const { email, password } = req.body;
  const errors = [];
  const data = { pageTitle: 'Sign up - Page' };

  if(password.length < 2) errors.push({ msg : 'Password at least 2 characters' });

  if(errors.length > 0) {
    data.errors = errors;
    res.render('signup', data);
  }else {
    User.findOne({ email: email }, (err, user) => {
      if (err) throw err;
      //if email dont exist
      if (!user) {
        bcrypt.hash(password, 10, async (err, hash) => {
          const newUser = new User({ email: email, password: hash });
          await newUser.save();
          //Redirect to login with flash message for successful signup
          req.flash('success_msg', 'You have been successfully sign up');
          res.redirect('/login');
        });
      } else {
        //Render signup with error message
        errors.push({ msg : 'The user already exist' });
        data.errors = errors;
        res.render('signup', data);
      }
    });
  }
});

router.post('/login', (req = request, res = response) => {
  const { email, password } = req.body;
  const errors = [];
  const data = { pageTitle : 'Log in - Page' };

  User.findOne({ email: email }, (err, user) => {
    if (err) throw err;
    //if user exist
    if (user) {
      //check if password is correct
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;

        if (result) {
          req.session.user = user;
          res.redirect('/profile');
        } else {
          errors.push({ msg: 'Password incorrect' });
          data.errors = errors;
          res.render('login', data);
        }
      });
    } else {
      //if user dont exist
      errors.push({ msg: 'User does not exist' });
      data.errors = errors;
      res.render('login', data);
    }
  });
});

router.get('/logout', (req, res) =>{
  req.session.user = null;
  res.redirect('/login'); 
});
function isAuthenticated(req, res, next) {
  if(!req.session.user) {
    return next();
  }
  res.redirect('/profile');
}

router.get('/delete_account', (req, res) => {
  User.deleteOne({ email : req.session.user.email })
    .then(function() {
      req.flash('success_msg', 'Your account has been successfully deleted!');
      //Kill the session.
      req.session.user = null;
      res.redirect('/signup');
    });
  //console.log(req.session.user.email);
});

module.exports = router;