const Joi           = require("joi");
const ExpressError      = require("./expressErrors");
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
module.exports = validateResort;