const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new Schema({
    firstname:{
        type:String,
        required:[true,'Enter first name is required'],
        unique:true
    },
    lastname:{
        type:String,
        required:[true,'Enter last name is required'],
        unique:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true
    }
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);
