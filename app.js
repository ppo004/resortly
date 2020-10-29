const express       = require("express");
const path          = require("path");
const app           = express();
const morgan        = require("morgan");
const mongoose      = require("mongoose");
const override      = require("method-override"); 
const Resort        = require("./modules/resort");
const ejs_engine    = require("ejs-mate");
// const {names , locations , descriptions} = require("./seed");
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
app.get("/resorts",async (req,res)=>{
    const resorts = await Resort.find({});
    res.render("resorts/index",{resorts:resorts});
});
app.get("/resorts/new",(req,res)=>{
    res.render("resorts/new")
}) 
app.post("/resorts",async(req,res)=>{
    const submittedData = req.body.resorts;
    const resort = new Resort(submittedData);
    await resort.save();
    res.redirect("/resorts");
})
app.get("/resorts/:id",async (req,res)=>{
    const resorts = await Resort.findById(req.params.id);
        res.render("resorts/show",{data:resorts});
});
app.get("/resorts/:id/edit",async (req,res)=>{
    const resorts = await Resort.findById(req.params.id);
    res.render("resorts/edit",{data:resorts}); 
});
app.put("/resorts/:id",async(req,res)=>{
   const resort = await Resort.findByIdAndUpdate(req.params.id,{title:req.body.resorts.title,location:req.body.resorts.location});
    res.redirect(`/resorts/${resort._id}`);
})
app.delete("/resorts/:id",async(req,res)=>{
    const resort = await Resort.findByIdAndDelete(req.params.id);
    res.redirect("/resorts");
})
app.use((req,res)=>{
    res.status(404).send("<h1>Error</h1>")
})
app.listen(3000,()=>{
    console.log("Resorts app starting on port 3000")
})