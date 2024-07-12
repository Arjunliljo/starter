const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const AppError = require('../Utilities/appError');

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
    required: [true, 'User must have a password'],
    minlength: [8, 'Password must have atleast 8 characters'],
    select: false,
  },
  confirmPassword: {
    required: [true, 'User must have a confirm password'],
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
  role: {
    type: String,
    enum: {
      values: ['USER', 'TOURGUIDE', 'LEADTOURGUIDE', 'ADMIN'],
      message: 'Role must be user, tourguide, leadtourguide or an admin',
    },
    default: 'USER',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.changePasswordDate = Date.now();
  next();
});

userSchema.pre('save', async function (next) {
  //make sure only run this if the password is modified
  if (!this.isModified('password')) return next();

  if (this.confirmPassword !== this.password)
    return next(new AppError('Password did not matching', 404));

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

// protect middle ware using this
userSchema.methods.changedPasswordAfter = function (jwtTimeStamb) {
  if (this.changePasswordDate) {
    const changedTimeStamb = parseInt(this.changePasswordDate.getTime()) / 1000;
    return jwtTimeStamb < changedTimeStamb;
  }

  return false;
};

userSchema.methods.createPasswordsResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
