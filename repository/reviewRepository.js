const Resort = require("../modules/resort");
const Review = require("../modules/review");

const addReview = async (reviewData, authorId) => {
  const reviews = new Review(reviewData);
  reviews.author = authorId;
  await reviews.save();
  return reviews;
};

const findReviewById = async (reviewId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }
};

const deleteReviewById = async (reviewId, authorId) => {
  try {
    const review = findReviewById(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    if (!authorId.equals(review.author)) {
      throw new Error("You are not allowed to do that");
    }
    await Review.findByIdAndDelete(reviewId);
  } catch (error) {
    throw new Error(`Error deleting review by ID: ${error.message}`);
  }
};

module.exports = {
  addReview,
  findReviewById,
  deleteReviewById,
};
