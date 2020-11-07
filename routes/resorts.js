const express       = require("express");
const router        = express.Router();
const catchAsync    = require("../utils/catchAsync");
const Resort        = require("../modules/resort");
const Joi           = require("joi");
const Review        = require("../modules/review");


const validateResort = (req,res,next)=>{
    const resortSchema = Joi.object({
        resorts:Joi.object({
            title:Joi.string().required(),
            price:Joi.number().required().min(1000),
            description:Joi.string().required(),
            image:Joi.string().required(),
            location:Joi.string().required()
        }).required()
    });
const {error} = resortSchema.validate(req.body);
console.log(error);
if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg,400)
}
else{
    next();
}
}

router.get("/",catchAsync(async (req,res)=>{
    const resorts = await Resort.find({});
    res.render("resorts/index",{resorts:resorts});
}));
router.get("/new",(req,res)=>{
    res.render("resorts/new")
}) 
router.post("/",validateResort,catchAsync(async(req,res,next)=>{
    const submittedData = req.body.resorts;
    const resort = new Resort(submittedData);
    await resort.save();
    res.redirect("/resorts");
}));
router.get("/:id",catchAsync(async (req,res)=>{
    const resorts = await Resort.findById(req.params.id);
    let reviewsCollected = [];
    for(let y of resorts.reviews){
        let x = await Review.findById(y);
        reviewsCollected.push(x);
    }
    console.log(reviewsCollected)
        res.render("resorts/show",{data:resorts,reviews:reviewsCollected});
}));
router.get("/:id/edit",catchAsync(async (req,res)=>{
    const resorts = await Resort.findById(req.params.id);
    res.render("resorts/edit",{data:resorts}); 
}));
router.put("/:id",validateResort,catchAsync(async(req,res)=>{
    const resort = await Resort.findByIdAndUpdate(req.params.id,{title:req.body.resorts.title,location:req.body.resorts.location,description:req.body.resorts.description,image:req.body.resorts.image,price:req.body.resorts.price});
     res.redirect(`/resorts/${resort._id}`);
 }))
router.delete("/:id",catchAsync(async(req,res)=>{
    const resort = await Resort.findByIdAndDelete(req.params.id);
    res.redirect("/resorts");
})) 

module.exports = router;
