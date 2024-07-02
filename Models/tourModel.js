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
  difficulty: {
    type: String,
    required: [true, 'Tour must have a dificulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },

  priceDiscount: Number,

  imageCover: {
    type: String,
    required: [true, 'Tour must have a cover image'],
  },
  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },

  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourShema);

module.exports = Tour;
