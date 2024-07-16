//raiting createdAt, ref to tour, review, ref to user

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review Must contains words..'],
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

reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'tour', select: 'name' });
  this.populate({ path: 'user', select: 'name' });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
