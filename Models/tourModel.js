const mongoose = require('mongoose');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      trim: true,
      unique: true,
      maxlength: [40, 'A Tour name must be less than or equal 40 characters'],
      minlength: [
        10,
        'A Tour name must be greaterthan or equal to 10 characters',
      ],
      // validate: [validator.isAlpha, 'Tour should only contain charachters!'],
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A Tour must have rating gte 1'],
      max: [5, 'A Tour mus have rating lte 5'],
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

    priceDiscount: {
      type: Number,
      default: 10,
      validate: {
        validator: function (val) {
          //THIS IS ONLY WORK WHILE CREATING THE DOCUMENT NOT UPDATING --IMPORTANT
          return val < this.price;
        },
        message: 'Discount must below the actual price',
      },
    },

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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeek').get(function () {
  return Math.round(this.duration / 7);
});

//DOCUMENT MIDDLEWARE : runs before .save() cammand and .create() cammand
tourSchema.pre('save', function (next) {
  // this.slug = slugify(this.name, { lower: true });
  this.slug = this.name.toLowerCase().split(' ').join('-');
  next();
});
tourSchema.pre('save', function (next) {
  console.log(`${this.name} will be saved...`);
  next();
});

// // runs after the file has been saved
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // if we made a getAll resquest this we will not get this tour
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // if we made a getAll resquest this we will not get this tour
  console.log(`Query took ${Date.now() - this.start} to process!`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
