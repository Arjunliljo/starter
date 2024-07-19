//raiting createdAt, ref to tour, review, ref to user

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review Must contains words..'],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    rating: {
      type: Number,
      min: [1, 'rating should atleast 1'],
      max: [5, 'rating should maximum 5'],
      required: [true, 'Review Must have a rating..'],
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review should belongs to a Tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review should belongs to a User'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// This will calculate total ratings of and the number of ratings of the current tour
reviewSchema.statics.calcAvgRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        numRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRatings,
    ratingsQuantity: stats[0].numRatings,
  });
};

//One user can only post one review on a tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//Updating the tour document itself when creating a new rating
reviewSchema.post('save', async function (next) {
  if (!this.tour) return;
  await this.constructor.calcAvgRatings(this.tour);
  // Review.calcAvgRatings(this.tour);
});

//Updating Tour ratings and average when updating or deleting the review
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (!doc) return;
  await Review.calcAvgRatings(doc.tour);
});

reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'tour', select: 'name' });
  this.populate({ path: 'user', select: 'name' });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
