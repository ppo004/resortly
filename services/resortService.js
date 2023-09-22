const resortRepository = require("../repository/resportRepository");
const cloudinary = require("../cloudinary");
const fileUpload = require("../utils/fileUpload/cloudinaryUpload");
const getAllResorts = async () => {
  try {
    const resorts = await resortRepository.getAllResorts();
    return resorts;
  } catch (error) {
    throw new Error("Error fetching resorts from the service");
  }
};

const createResort = async (resortData, userId, images, deleteImages) => {
  try {
    const resort = await resortRepository.createResort(
      resortData,
      userId,
      images,
      deleteImages
    );
    return resort;
  } catch (error) {
    throw new Error("Error creating resort from the service");
  }
};

const getResortById = async (resortId) => {
  try {
    const { resort, reviews } = await resortRepository.getResortById(resortId);
    return { resort, reviews };
  } catch (error) {
    throw new Error("Error fetching resort by ID from the service");
  }
};

const updateResort = async (
  resortId,
  resortData,
  images,
  deleteImages,
  userId
) => {
  try {
    const updatedResort = await resortRepository.updateResort(
      resortId,
      resortData,
      images,
      deleteImages,
      userId
    );
    if (deleteImages) {
      for (let filename of deleteImages) {
        await fileUpload.deleteImages(filename)
      }
    }

    return updatedResort;
  } catch (error) {
    throw new Error(`Error updating resort from the service: ${error.message}`);
  }
};

const deleteResortById = async (resortId, userId) => {
  try {
    const deletedResort = await resortRepository.deleteResortById(
      resortId,
      userId
    );
    return deletedResort;
  } catch (error) {
    throw new Error(`Error deleting resort from the service: ${error.message}`);
  }
};

module.exports = {
  getAllResorts,
  createResort,
  getResortById,
  updateResort,
  deleteResortById,
};
