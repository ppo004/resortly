const {cloudinary}  =  require("../../cloudinary");

const deleteImages = async (filename)=>{
    await cloudinary.uploader.destroy(filename);
}

module.exports = {
    deleteImages
  };