const sinon = require('sinon');
const chai = require('chai');
const { expect } = chai;

const reviewService = require('../reviewService');
const ReviewRepository = require('../../repository/reviewRepository');
const ResortRepository = require('../../repository/resortRepository');

describe('reviewService', () => {
  describe('addReview', () => {
    it('should add a review to a resort', async () => {
      const resortId = 'resortId123';
      const reviewData = { text: 'Great resort!' };
      const userId = 'userId123';

      sinon.stub(ReviewRepository, 'addReview').resolves(reviewData);
      sinon.stub(ResortRepository, 'addReview').resolves();

      const result = await reviewService.addReview(resortId, reviewData, userId);

      expect(result).to.deep.equal(reviewData);

      ReviewRepository.addReview.restore();
      ResortRepository.addReview.restore();
    });

    it('should throw an error when adding review fails', async () => {
      const resortId = 'resortId123';
      const reviewData = { text: 'Great resort!' };
      const userId = 'userId123';

      sinon.stub(ReviewRepository, 'addReview').rejects(new Error('Fake error'));

      try {
        await reviewService.addReview(resortId, reviewData, userId);
      } catch (error) {
        expect(error.message).to.equal('Error adding review');
      }

      ReviewRepository.addReview.restore();
    });
  });

  describe('deleteReview', () => {
    it('should delete a review from a resort', async () => {
      const resortId = 'resortId123';
      const reviewId = 'reviewId123';
      const userId = 'userId123';

      sinon.stub(ResortRepository, 'deleteReview').resolves();
      sinon.stub(ReviewRepository, 'deleteReview').resolves();

      await reviewService.deleteReview(resortId, reviewId, userId);

      ResortRepository.deleteReview.restore();
      ReviewRepository.deleteReview.restore();
    });

    it('should throw an error when deleting review fails', async () => {
      const resortId = 'resortId123';
      const reviewId = 'reviewId123';
      const userId = 'userId123';

      sinon.stub(ResortRepository, 'deleteReview').rejects(new Error('Fake error'));

      try {
        await reviewService.deleteReview(resortId, reviewId, userId);
      } catch (error) {
        expect(error.message).to.equal('Error deleting review');
      }

      ResortRepository.deleteReview.restore();
    });
  });

  describe('findById', () => {
    it('should find a review by ID', async () => {
      const reviewId = 'reviewId123';
      const reviewData = { text: 'Great resort!' };

      sinon.stub(ReviewRepository, 'findReviewById').resolves(reviewData);

      const result = await reviewService.findById(reviewId);

      expect(result).to.deep.equal(reviewData);

      ReviewRepository.findReviewById.restore();
    });

    it('should throw an error when finding review by ID fails', async () => {
      const reviewId = 'reviewId123';

      sinon.stub(ReviewRepository, 'findReviewById').rejects(new Error('Fake error'));

      try {
        await reviewService.findById(reviewId);
      } catch (error) {
        expect(error.message).to.equal('Fake error');
      }

      ReviewRepository.findReviewById.restore();
    });
  });
});
