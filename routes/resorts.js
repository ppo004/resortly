const express       = require("express");
const router        = express.Router();
const catchAsync    = require("../utils/catchAsync");
const Resort        = require("../modules/resort");
const Joi           = require("joi");
const Review        = require("../modules/review");
const ExpressError  = require("../utils/expressErrors");
const isLoggedIn    = require("../isLoggedinMiddleware");
const {cloudinary,storage}     = require("../cloudinary/index");
const multer        = require('multer');
const upload        = multer({storage});
// const mboxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mboxToken = process.env.Mapbox_PublicToken;
// const geoCoder = mboxGeoCoding({accessToken : mboxToken});
const resortController = require("../controllers/resortController");
const validateResort = (req,res,next)=>{
    const resortSchema = Joi.object({
        resorts:Joi.object({
            title:Joi.string().required(),
            price:Joi.number().required().min(1000),
            description:Joi.string().required(),
            // image:Joi.string().required(),
            location:Joi.string().required()
        }).required(),
        deleteImages: Joi.array()
    });
const {error} = resortSchema.validate(req.body);
if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg,400)
}
else{
    next();
}
}
router.route('/')
  .get(catchAsync(resortController.getAllResorts))
  .post(isLoggedIn, upload.array('image'), validateResort, catchAsync(resortController.createResort));

router.get("/new", isLoggedIn, (req, res) => {
  res.render("resorts/new");
});

router.route("/:id")
  .get(catchAsync(resortController.getResortById))
  .put(isLoggedIn, upload.array('image'), validateResort, catchAsync(resortController.updateResort))
  .delete(isLoggedIn, catchAsync(resortController.deleteResort));

router.get("/:id/edit", isLoggedIn, catchAsync(resortController.getEditPage));

module.exports = router;