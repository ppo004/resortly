const express       = require("express");
const router        = express.Router({mergeParams:true});
const catchAsync    = require("../utils/catchAsync");
const Resort        = require("../modules/resort");
const Joi           = require("joi");
const Review        = require("../modules/review");
const ExpressError  = require("../utils/expressErrors");
const isLoggedIn    = require("../isLoggedinMiddleware");
const reviewService = require('../services/reviewService')
const resortService = require('../services/resortService');

const validateReview = (req,res,next)=>{
    const schemaReview = Joi.object({
        review:Joi.object({
            rating: Joi.number().required(),
            body:Joi.string().required()
        })
    }).required()
    const {error} = schemaReview.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

router.post("/",isLoggedIn, validateReview,async (req,res)=>{
    const review = await reviewService.addReview(req.params.id);
    resortService.addReview(review,req.user._id);
    req.flash('success',`Added review`);
    res.redirect(`/resorts/${req.params.id}`);
})

router.delete("/:reviewID", isLoggedIn, catchAsync(async (req, res) => {
  const { id, reviewID } = req.params;
  const currentUser = req.user._id;
  try {
    const review = await reviewService.findById(reviewID);
    if (!currentUser.equals(review.author)) {
      req.flash("error", "You are not allowed to do that");
      res.redirect(`/resorts/${id}`);
    } else {
      await reviewService.deleteReview(id, reviewID, currentUser);
      req.flash('success', 'Deleted review');
      res.redirect(`/resorts/${id}`);
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    req.flash("error", "Failed to delete review");
    res.redirect(`/resorts/${id}`);
  }
}));

module.exports = router;
