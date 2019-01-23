'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Address = new Schema({
  floor: {
    type: Number
  },
  flat: {
    type: Number
  },
  building: {
    type: String
  }
});

var UserSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    minlength: [3, 'name is atleast of 3 characters'],
    maxlength: [30, 'name does not exceeds 30 characters'],
    required: [true, 'please enter your name']
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    lowercase: true,
    minlength: [3, 'email is atleast of 3 characters'],
    maxlength: [30, 'email does not exceeds 30 characters'],
    match: /\S+@\S+\.\S+/,
    unique: true,
    required: [true, 'please enter your email']
  },
  mobile: {
    type: Number,
    required: [true, 'please enter your email']
  },
  address: Address,
  rentAgreement: String,
  isVerifiedEmail: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true
  },
  revoke_count: {
    type: Number,
    default: 0
  },
  registration_timestamp: {
    type: Date,
    default: Date.now
  },
  last_login_timestamp: {
    type: Date
  },
  activation_timestamp: {
    type: Date
  },
  deactivation_timestamp: {
    type: Date
  }
});

module.exports = mongoose.model('user', UserSchema, 'users');