const resortService = require("../services/resortService");

const getAllResorts = async (req, res) => {
  try {
    const resorts = await resortService.getAllResorts();
    res.render("resorts/index", { resorts });
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
    await resortService.createResort(resortData, userId, images, deleteImages);
    req.flash("success", "Added resort");
    res.redirect("/resorts");
  } catch (error) {
    console.error("Error creating resort:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getResortById = async (req, res) => {
  try {
    const resortId = req.params.id;
    const { resort, reviews } = await resortService.getResortById(resortId);
    if (!resort) {
      req.flash("error", "Cannot find the resort");
      res.redirect("/resorts");
      return;
    }
    res.render("resorts/show", { data: resort, reviews });
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
    const updatedResort = await resortService.updateResort(
      resortId,
      resortData,
      images,
      deleteImages,
      userId
    );
    req.flash("success", `Updated ${updatedResort.title}`);
    res.redirect(`/resorts/${updatedResort._id}`);
  } catch (error) {
    console.error("Error updating resort:", error.message);
    req.flash("error", error.message);
    res.redirect(`/resorts/${req.params.id}`);
  }
};

const deleteResort = async (req, res) => {
  try {
    const userId = req.user._id;
    const resortId = req.params.id;
    await resortService.deleteResortById(resortId, userId);
    req.flash("success", `Deleted successfully`);
    res.redirect("/resorts");
  } catch (error) {
    console.error("Error deleting resort:", error.message);
    req.flash("error", error.message);
    res.redirect(`/resorts/${req.params.id}`);
  }
};

const getEditPage = async (req, res) => {
  try {
    const resortId = req.params.id;
    const resorts = await resortService.getResortById(resortId);
    if (!resorts) {
      req.flash("error", "Cannot find and edit the resort");
      res.redirect("/resorts");
      return;
    }
    res.render("resorts/edit", { data: resorts });
  } catch (error) {
    console.error("Error fetching resort for edit:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllResorts,
  createResort,
  getResortById,
  updateResort,
  deleteResort,
  getEditPage,
};
