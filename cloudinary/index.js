const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name:process.env.Cloudinary_cloudName,
    api_key:process.env.Cloudinary_APIKey,
    api_secret:process.env.Cloudinary_APISecret
});
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"Resortly",
        allowedFormats:['jpeg','png','jpg']
    }
});
module.exports = {
    cloudinary,
    storage
}