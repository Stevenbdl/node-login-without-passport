const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp', 
  { useNewUrlParser : true, useUnifiedTopology : true })
  .then(db => {console.log('Database connected successfully');})
  .catch(err => {console.log(err)});

module.exports = mongoose;