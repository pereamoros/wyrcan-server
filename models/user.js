'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
  role: String,
  description: {
    type: String,
    default: ' '
  },
  appliedJobs: [{
    job: {
      type: ObjectId,
      ref: 'Job'
    },
    status: {
      type: String,
      default: 'pending'
    }
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
