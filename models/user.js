const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// User Schema
const userSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true,
    // index: true
  },
  password:{
    type:String,
    required:true
  }
});

const User = module.exports = mongoose.model('User', userSchema);
