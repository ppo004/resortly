const mongoose = require("mongoose");
const {Schema} = mongoose;
const reviewSchema = new Schema({
    body:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5]
    }
});
module.exports = mongoose.model("Review",reviewSchema);
