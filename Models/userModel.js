const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Tell us your name'],
    maxlength: [20, 'User name should be less than 20 characters'],
    minlength: [3, 'User name should be greater than 3 characters'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email..'],
    unique: true,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'User must hava a password'],
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Password did not matching',
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
