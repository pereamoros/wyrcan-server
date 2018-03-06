'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
  role: String,
  description: {
    type: String,
    default: ' '
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
