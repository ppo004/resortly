const express           = require("express");
const path              = require("path");
const app               = express();
const morgan            = require("morgan");
const mongoose          = require("mongoose");
const override          = require("method-override"); 
const Resort            = require("./modules/resort");
const ejs_engine        = require("ejs-mate");
const catchAsync        = require("./utils/catchAsync");
const ExpressError      = require("./utils/expressErrors");
const validateResort    = require("./utils/validateResort");

mongoose.connect('mongodb://localhost:27017/resortly',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true}).then(()=>{
    console.log("CONNECTION TO RESORTLY OPEN!!!");
}).catch((err)=>{
    console.log(err);
})
app.set("view engine","ejs");
app.engine('ejs',ejs_engine);
app.set("views",path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(override('_method'));
app.use(morgan('tiny'));

app.get("/",(req,res)=>{
    res.send("<h1>Wilkommen</h1>");
})
app.get("/resorts",catchAsync(async (req,res)=>{
    const resorts = await Resort.find({});
    res.render("resorts/index",{resorts:resorts});
}));
app.get("/resorts/new",(req,res)=>{
    res.render("resorts/new")
}) 
app.post("/resorts",validateResort,catchAsync(async(req,res,next)=>{
    const submittedData = req.body.resorts;
    const resort = new Resort(submittedData);
    await resort.save();
    res.redirect("/resorts");
}));
app.get("/resorts/:id",catchAsync(async (req,res)=>{
    const resorts = await Resort.findById(req.params.id);
        res.render("resorts/show",{data:resorts});
}));
app.get("/resorts/:id/edit",catchAsync(async (req,res)=>{
    const resorts = await Resort.findById(req.params.id);
    res.render("resorts/edit",{data:resorts}); 
}));
app.put("/resorts/:id",validateResort,catchAsync(async(req,res)=>{
    const resort = await Resort.findByIdAndUpdate(req.params.id,{title:req.body.resorts.title,location:req.body.resorts.location,description:req.body.resorts.description,image:req.body.resorts.image,price:req.body.resorts.price});
     res.redirect(`/resorts/${resort._id}`);
 }))
app.delete("/resorts/:id",catchAsync(async(req,res)=>{
    const resort = await Resort.findByIdAndDelete(req.params.id);
    res.redirect("/resorts");
}))
app.all("*",(req,res,next)=>{
    next(new ExpressError('Page not found',404));
});
// app.use((req,res)=>{
//     res.status(404).send("<h1>Error</h1>")
// });
app.use((err,req,res,next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'An Error occured';
    res.status(statusCode).render("error",{err:err,code:statusCode});
})
app.listen(3000,()=>{
    console.log("Resorts app starting on port 3000")
})