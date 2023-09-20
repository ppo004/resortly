const Resort = require("../modules/resort");
const { cloudinary } = require("../cloudinary/index");

const getAllResorts = async (req, res) => {
  try {
    const resorts = await Resort.find({});
    res.render("resorts/index", { resorts: resorts });
  } catch (error) {
    console.error("Error fetching resorts:", error);
    res.status(500).send("Internal Server Error");
  }
};

const createResort = async (req, res) => {
    try {
      const userId = req.user._id;
      const resortData = req.body.resorts;
      const images = req.files;
      const deleteImages = req.body.deleteImages;
      const resort = await resortRepository.createResort(resortData, userId, images, deleteImages);
      req.flash('success', "Added resort");
      res.redirect("/resorts");
    } catch (error) {
      console.error("Error creating resort:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  const getResortById = async (req, res) => {
    try {
      const resortId = req.params.id;
      const { resort, reviews } = await resortRepository.getResortById(resortId);
      if (!resort) {
        req.flash("error", "Cannot find the resort");
        res.redirect('/resorts');
        return;
      }
      res.render("resorts/show", { data: resort, reviews: reviews });
    } catch (error) {
      console.error("Error fetching resort by ID:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  const updateResort = async (req, res) => {
    try {
      const userId = req.user._id;
      const resortData = req.body.resorts;
      const images = req.files;
      const deleteImages = req.body.deleteImages;
      const resortId = req.params.id;
      const updatedResort = await resortRepository.updateResort(
        resortId,
        resortData,
        images,
        deleteImages,
        userId
      );
      if (deleteImages) {
      for (let filename of deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
    }
      req.flash('success', `Updated ${updatedResort.title}`);
      res.redirect(`/resorts/${updatedResort._id}`);
    } catch (error) {
      console.error("Error updating resort:", error.message);
      req.flash('error', error.message);
      res.redirect(`/resorts/${req.params.id}`);
    }
  };

  const deleteResort = async (req, res) => {
    try {
      const userId = req.user._id;
      const resortId = req.params.id;
      const deletedResort = await resortRepository.deleteResortById(
        resortId,
        userId
      );
      req.flash('success', `Deleted successfully`);
      res.redirect("/resorts");
    } catch (error) {
      console.error("Error deleting resort:", error.message);
      req.flash('error', error.message);
      res.redirect(`/resorts/${req.params.id}`);
    }
  };


const getEditPage = async (req,res) => {
    const resorts = await Resort.findById(req.params.id);
    if(!resorts){
        req.flash("error","Cannot find and edit the resort");
        res.redirect('/resorts');
    }
    res.render("resorts/edit",{data:resorts}); 
}
module.exports = {
  getAllResorts,
  createResort,
  getResortById,
  updateResort,
  deleteResort,
  getEditPage
};
