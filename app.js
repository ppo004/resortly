/*----------------------------------PACKAGE IMPORTS----------------------------------*/
const express                            = require("express");
const path                               = require("path");
const app                                = express();
const morgan                             = require("morgan");
const mongoose                           = require("mongoose");
const override                           = require("method-override"); 
const ejs_engine                         = require("ejs-mate");
/*----------------------------------MODULES IMPORTS----------------------------------*/
const ExpressError                       = require("./utils/expressErrors");
/*----------------------------------ROUTES IMPORTS----------------------------------*/
const resorts                            = require("./routes/resorts");
const reviews                            = require("./routes/reviews");
/*----------------------------------MONGOOSE CONNECTION----------------------------------*/
mongoose.connect('mongodb://localhost:27017/resortly',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true}).then(()=>{
    console.log("CONNECTION TO RESORTLY OPEN!!!");
}).catch((err)=>{
    console.log(err);
});
/*----------------------------------APP SETTINGS----------------------------------*/
app.set("view engine","ejs"); // to set the rendering to ejs
app.engine('ejs',ejs_engine); // to use html boilerplate stuff
app.set("views",path.join(__dirname,'views')); // to run app.js outside the directory
/*----------------------------------MIDDLEWARES----------------------------------*/
app.use(express.urlencoded({extended:true})); // used for body parsing
app.use(override('_method')); // to use patch, delete through post requests
app.use(morgan('tiny')); // debugging middleware
/*----------------------------------ROUTES----------------------------------*/
app.use("/resorts",resorts);
app.use("/resorts/:id/reviews",reviews);
app.get("/",(req,res)=>{
    res.send("<h1>Wilkommen</h1>");
})
app.all("*",(req,res,next)=>{
    next(new ExpressError('Page not found',404));
});
/*----------------------------------ERROR MIDDLEWARE----------------------------------*/
app.use((err,req,res,next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'An Error occured';
    res.status(statusCode).render("error",{err:err,code:statusCode});
});
/*----------------------------------PORT-LISTENING----------------------------------*/
app.listen(process.env.PORT||3000,()=>{
    console.log("Resorts app starting on port 3000")
});