const express       = require("express");
const router        = express.Router({mergeParams:true});
const catchAsync    = require("../utils/catchAsync");
const Resort        = require("../modules/resort");
const Joi           = require("joi");
const Review        = require("../modules/review");
const ExpressError  = require("../utils/expressErrors");
const isLoggedIn    = require("../isLoggedinMiddleware");

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
    const resort = await Resort.findById(req.params.id);
    const reviews = new Review(req.body.review);
    resort.reviews.push(reviews);
    await reviews.save();
    await resort.save();
    console.log(reviews);
    req.flash('success',`Added review`);
    res.redirect(`/resorts/${req.params.id}`);
})
router.delete("/:reviewID",isLoggedIn, catchAsync(async (req,res)=>{
    const {id,reviewID} = req.params;
    const resort = await Resort.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    const review = await Review.findByIdAndDelete(reviewID);
    req.flash('success',`Deleted review`);
    res.redirect(`/resorts/${id}`);
}))
module.exports = router;
