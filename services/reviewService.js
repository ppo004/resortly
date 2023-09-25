const ReviewRepository = require("../repository/reviewRepository");
const ResortRepository = require("../repository/resortRepository");

exports.addReview = async (resortId, reviewData, userId) => {
  try {
    const review = await ReviewRepository.addReview(reviewData, userId);
    await ResortRepository.addReview(resortId, review);
    return review;
  } catch (error) {
    throw new Error("Error adding review");
  }
};

exports.deleteReview = async (resortId, reviewId, userId) => {
  try {
    await ResortRepository.deleteReview(resortId, reviewId);
    await ReviewRepository.deleteReview(resortId, reviewId);
  } catch (error) {
    throw new Error("Error deleting review");
  }
};

exports.findById = async (reviewId) => {
    try{
        return await ReviewRepository.findReviewById(reviewId);
    }
    catch(error){
        throw error;
    }
}