const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const ImageSchema = new Schema({
        url:String,
        filename:String
});
const ResortSchema = new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images:[
        ImageSchema
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload','/upload/w_250')
})
ResortSchema.post('findOneAndDelete',async (doc)=>{
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
});
module.exports = mongoose.model("Resort",ResortSchema);