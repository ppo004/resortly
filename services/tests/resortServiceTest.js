const sinon = require('sinon');
const { expect } = require('chai');
const resortService = require('../resortService');
const resortRepository = require('../../repository/resportRepository');
const deleteFile = require('../../utils/fileUpload/cloudinaryUpload');


describe('getAllResorts', () => {
  it('should return resorts when the repository call is successful', async () => {
    const fakeResorts = [
      { _id: '1', name: 'Resort 1' },
      { _id: '2', name: 'Resort 2' },
    ];

    const getAllResortsStub = sinon.stub(resortRepository, 'getAllResorts').resolves(fakeResorts);

    const resorts = await resortService.getAllResorts();

    expect(resorts).to.deep.equal(fakeResorts);

    getAllResortsStub.restore();
  });

  it('should throw an error when the repository call fails', async () => {
    const getAllResortsStub = sinon.stub(resortRepository, 'getAllResorts').rejects(new Error('Fake error'));

    try {
      await resortService.getAllResorts();
    } catch (error) {
      expect(error.message).to.equal('Error fetching resorts from the service');
    }

    getAllResortsStub.restore();
  });
});

describe('createResort', () => {
    it('should return the created resort when the repository call is successful', async () => {
      const fakeResortData = { name: 'Test Resort' };
      const fakeUserId = '123456';
      const fakeImages = ['image1.jpg', 'image2.jpg'];
      const fakeDeleteImages = ['oldImage1.jpg'];
  
      const fakeResort = {
        _id: 'resortId123',
        reviews:[],
        images:[],
        location:"location",
        description:"description",
        price:2000,
        title:"Resort test"
      };
  
      const createResortStub = sinon.stub(resortRepository, 'createResort').resolves(fakeResort);
  
      const result = await resortService.createResort(fakeResortData, fakeUserId, fakeImages, fakeDeleteImages);
  
      expect(result).to.deep.equal(fakeResort);
  
      createResortStub.restore();
    });
  
    it('should throw an error when the repository call fails', async () => {
      const fakeResortData = { name: 'Test Resort' };
      const fakeUserId = '123456';
      const fakeImages = ['image1.jpg', 'image2.jpg'];
      const fakeDeleteImages = ['oldImage1.jpg'];
  
      const createResortStub = sinon.stub(resortRepository, 'createResort').rejects(new Error('Fake error'));
  
      try {
        await resortService.createResort(fakeResortData, fakeUserId, fakeImages, fakeDeleteImages);
      } catch (error) {
        expect(error.message).to.equal('Error creating resort from the service');
      }
  
      createResortStub.restore();
    });
  });
  
  describe('getResortById', () => {
  it('should return resort and reviews when the repository call is successful', async () => {
    const fakeResortId = 'fakeId';
    const fakeResort = { _id: fakeResortId, name: 'Fake Resort' };
    const fakeReviews = [{ _id: 'reviewId1', text: 'Review 1' }];

    const getResortByIdStub = sinon.stub(resortRepository, 'getResortById').resolves({ resort: fakeResort, reviews: fakeReviews });

    const result = await resortService.getResortById(fakeResortId);

    expect(result).to.deep.equal({ resort: fakeResort, reviews: fakeReviews });

    getResortByIdStub.restore();
  });

  it('should throw an error when the repository call fails', async () => {
    const fakeResortId = 'fakeId';

    const getResortByIdStub = sinon.stub(resortRepository, 'getResortById').rejects(new Error('Fake error'));

    try {
      await resortService.getResortById(fakeResortId);
    } catch (error) {
      expect(error.message).to.equal('Error fetching resort by ID from the service');
    }

    getResortByIdStub.restore();
  });
});

describe('updateResort', () => {
    it('should return updated resort when the repository call is successful', async () => {
      const fakeResortId = 'fakeId';
      const fakeResortData = { title: 'Updated Resort' };
      const fakeImages = ['newImage1.jpg', 'newImage2.jpg'];
      const fakeDeleteImages = ['oldImage1.jpg'];
      const fakeUserId = 'fakeUserId';
  
      const fakeUpdatedResort = {
        _id: fakeResortId,
        title: 'Updated Resort',
        images: fakeImages,
      };
  
      const updateResortStub = sinon.stub(resortRepository, 'updateResort').resolves(fakeUpdatedResort);
      sinon.stub(deleteFile, 'deleteImages').resolves();
  
      const updatedResort = await resortService.updateResort(fakeResortId, fakeResortData, fakeImages, fakeDeleteImages, fakeUserId);
  
      expect(updatedResort).to.deep.equal(fakeUpdatedResort);
  
      updateResortStub.restore();
      deleteFile.deleteImages.restore();
    });
  
    it('should throw an error when the repository call fails', async () => {
      const fakeResortId = 'fakeId';
      const fakeResortData = { name: 'Updated Resort' };
      const fakeImages = ['newImage1.jpg', 'newImage2.jpg'];
      const fakeDeleteImages = ['oldImage1.jpg'];
      const fakeUserId = 'fakeUserId';
  
      const updateResortStub = sinon.stub(resortRepository, 'updateResort').rejects(new Error('Fake error'));
  
      try {
        await resortService.updateResort(fakeResortId, fakeResortData, fakeImages, fakeDeleteImages, fakeUserId);
      } catch (error) {
        expect(error.message).to.equal('Error updating resort from the service: Fake error');
      }
  
      updateResortStub.restore();
    });
  });
  
  describe('deleteResortById', () => {
    let deleteResortByIdStub;
  
    beforeEach(() => {
      deleteResortByIdStub = sinon.stub(resortRepository, 'deleteResortById');
    });
  
    afterEach(() => {
      deleteResortByIdStub.restore();
    });
  
    it('should return deleted resort when the repository call is successful', async () => {
      const fakeResortId = 'fakeId';
      const fakeUserId = 'fakeUserId';
  
      const fakeDeletedResort = {
        _id: fakeResortId,
        name: 'Deleted Resort',
      };
  
      deleteResortByIdStub.resolves(fakeDeletedResort);
  
      const deletedResort = await resortService.deleteResortById(fakeResortId, fakeUserId);
  
      expect(deletedResort).to.deep.equal(fakeDeletedResort);
    });
  
    it('should throw an error when the repository call fails', async () => {
      const fakeResortId = 'fakeId';
      const fakeUserId = 'fakeUserId';
  
      deleteResortByIdStub.rejects(new Error('Fake error'));
  
      try {
        await resortService.deleteResortById(fakeResortId, fakeUserId);
      } catch (error) {
        expect(error.message).to.equal('Error deleting resort from the service: Fake error');
      }
    });
  });
  