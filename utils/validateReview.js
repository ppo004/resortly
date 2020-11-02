const Joi           = require("joi");
const ExpressError      = require("./expressErrors");
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
module.exports = validateReview;