const mongoose = require("mongoose");
const {Schema} = mongoose;
const User = require("./user");
const reviewSchema = new Schema({
    body:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5]
    }
});
module.exports = mongoose.model("Review",reviewSchema);
