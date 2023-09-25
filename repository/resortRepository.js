const Resort = require("../modules/resort");
const Review = require("../modules/review");

const getAllResorts = async () => {
  try {
    const resorts = await Resort.find({});
    return resorts;
  } catch (error) {
    throw new Error("Error fetching resorts");
  }
};

const createResort = async (resortData, userId) => {
  try {
    const resort = new Resort(resortData);
    resort.author = userId;
    await resort.save();

    return resort;
  } catch (error) {
    throw new Error("Error creating resort");
  }
};

const getResortById = async (resortId) => {
    try {
      const resort = await Resort.findById(resortId).populate('author');
      if (!resort) {
        throw new Error("Resort not found");
      }
      let reviewsCollected = [];
      for (let y of resort.reviews) {
        let x = await Review.findById(y);
        reviewsCollected.push(x);
      }
      return { resort, reviews: reviewsCollected };
    } catch (error) {
      throw new Error("Error fetching resort by ID");
    }
  };

const updateResort = async (resortId, resortData, images, deleteImages, userId) => {
  try {
    const existingResort = await Resort.findById(resortId);
    if (!existingResort || !existingResort.author.equals(userId)) {
      throw new Error("You are not allowed to update this resort");
    }
    const updatedResort = await Resort.findByIdAndUpdate(
      resortId,
      {
        title: resortData.title,
        location: resortData.location,
        description: resortData.description,
        price: resortData.price,
      },
      { new: true }
    );
    const updatedImages = images.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    updatedResort.images.push(...updatedImages);
    if (deleteImages) {
      await updatedResort.updateOne({
        $pull: { images: { filename: { $in: deleteImages } } },
      });
    }
    await updatedResort.save();
    return updatedResort;
  } catch (error) {
    throw new Error("Error updating resort");
  }
};


const deleteResortById = async (resortId, userId) => {
  try {
    const existingResort = await Resort.findById(resortId);
    if (!existingResort || !existingResort.author.equals(userId)) {
      throw new Error("You are not allowed to delete this resort");
    }
    const deletedResort = await Resort.findByIdAndDelete(resortId);
    return deletedResort;
  } catch (error) {
    throw new Error("Error deleting resort");
  }
};

const addReview = async (resortId, review) => {
  const resort = getResortById(resortId);
  if (!resort) {
    throw new Error('Resort not found');
  }
  resort.reviews.push(review);
  await resort.save();
}

const deleteReview = async (resortId, reviewId) => {
  try {
    const resort = await Resort.findById(resortId);
    if (!resort) {
      throw new Error('Resort not found');
    }
    const reviewIndex = resort.reviews.indexOf(reviewId);
    if (reviewIndex === -1) {
      throw new Error('Review not found in the resort');
    }
    resort.reviews.splice(reviewIndex, 1);
    await resort.save();
  } catch (error) {
    throw new Error(`Error deleting review: ${error.message}`);
  }
};


module.exports = {
  getAllResorts,
  createResort,
  getResortById,
  updateResort,
  deleteResortById,
  deleteReview,
  addReview
};
