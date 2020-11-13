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
.get(catchAsync(async (req,res)=>{
    const resorts = await Resort.find({});
    res.render("resorts/index",{resorts:resorts});
}))
.post(isLoggedIn,upload.array('image'), validateResort,async(req,res,next)=>{
    try{
    const submittedData = req.body.resorts;
    let resort = new Resort(submittedData);
    console.log(req.files);
    resort.images = req.files.map((file)=>{
        return {
            url:file.path,
            filename:file.filename
        }
    })
    resort.author = req.user._id;
    await resort.save();
    req.flash('success',"Added resort");
    res.redirect("/resorts");
    }
    catch(error){
        console.log("We have an error");
        next(error);
    } 
});


router.get("/new",isLoggedIn, (req,res)=>{
    res.render("resorts/new")
}) 



router.route("/:id")
.get(catchAsync(async (req,res)=>{
    const resorts = await Resort.findById(req.params.id).populate('author');
    if(!resorts){
        req.flash("error","Cannot find the resort");
        res.redirect('/resorts');
    }
    let reviewsCollected = [];
    for(let y of resorts.reviews){
        let x = await Review.findById(y);
        reviewsCollected.push(x);
    }
    console.log(reviewsCollected,req.user_id);
        res.render("resorts/show",{data:resorts,reviews:reviewsCollected});
}))
.put(isLoggedIn,upload.array('image'), validateResort,catchAsync(async(req,res)=>{
    const isPresent = await Resort.findById(req.params.id);
    if(!isPresent.author.equals(req.user._id) ){
        req.flash('error','You are not allowed to do that');
        return res.redirect(`/resorts/${req.params.id}`);
    }
    let images = req.files.map((file)=>{
        return {
            url:file.path,
            filename:file.filename
        }
    });
    const resort = await Resort.findByIdAndUpdate(req.params.id,{title:req.body.resorts.title,location:req.body.resorts.location,description:req.body.resorts.description,price:req.body.resorts.price});
    resort.images.push(...images);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await resort.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    resort.save();
    req.flash('success',`Updated ${req.body.resorts.title}`);
    res.redirect(`/resorts/${resort._id}`);
 })).delete(isLoggedIn, catchAsync(async(req,res)=>{
    const isPresent = await Resort.findById(req.params.id);
    if(!isPresent.author.equals(req.user._id) ){
        req.flash('error','You are not allowed to do that');
        return res.redirect(`/resorts/${req.params.id}`);
    }
    const resort = await Resort.findByIdAndDelete(req.params.id);
    req.flash('success',`Deleted successfully`);
    res.redirect("/resorts");
}));



router.get("/:id/edit",isLoggedIn, catchAsync(async (req,res)=>{
    const resorts = await Resort.findById(req.params.id);
    if(!resorts){
        req.flash("error","Cannot find and edit the resort");
        res.redirect('/resorts');
    }
    res.render("resorts/edit",{data:resorts}); 
}));

module.exports = router;
