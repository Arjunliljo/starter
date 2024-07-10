const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'User must hava a password'],
    min: [8, 'Password must have atleast 8 characters'],
    select: false,
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
  changePasswordDate: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  //make sure only run this if the password is modified
  if (!this.isModified('password')) return next();

  //hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //delete the password
  this.confirmPassword = undefined;
  next();
});

// instance method that available on every document that created with User model
userSchema.methods.correctPassword = async function (
  loginPassword,
  hashPassword,
) {
  return await bcrypt.compare(loginPassword, hashPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamb) {
  if (this.changePasswordDate) {
    const changedTimeStamb = parseInt(this.changePasswordDate.getTime()) / 1000;
    console.log(jwtTimeStamb, changedTimeStamb);
    return jwtTimeStamb < changedTimeStamb;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
