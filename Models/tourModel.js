const mongoose = require('mongoose');

const tourShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    trim: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size'],
  },
  dificulty: {
    type: String,
    required: [true, 'Tour must have a dificulty'],
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price'],
  },
  ratingsAvg: {
    type: Number,
    default: 4.5,
  },
  ratingQty: {
    type: Number,
    default: 0,
  },

  priceDiscount: Number,

  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have a cover image'],
  },
  imgaes: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourShema);

module.exports = Tour;
