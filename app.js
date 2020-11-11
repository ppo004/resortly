/*----------------------------------PACKAGE IMPORTS----------------------------------*/
const express                            = require("express");
const path                               = require("path");
const app                                = express();
const morgan                             = require("morgan");
const mongoose                           = require("mongoose");
const override                           = require("method-override"); 
const ejs_engine                         = require("ejs-mate");
const session                            = require("express-session");
const flash                              = require("connect-flash");
const passport                           = require("passport");
const passportLocal                      = require("passport-local");
const User                               = require("./modules/user");
/*----------------------------------MODULES IMPORTS----------------------------------*/
const ExpressError                       = require("./utils/expressErrors");
/*----------------------------------ROUTES IMPORTS----------------------------------*/
const resortsRoutes                      = require("./routes/resorts");
const reviewsRoutes                      = require("./routes/reviews");
const userRoutes                         = require("./routes/user")
/*----------------------------------MONGOOSE CONNECTION----------------------------------*/
mongoose.connect('mongodb://localhost:27017/resortly',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false}).then(()=>{
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
app.use(express.static(path.join(__dirname,'public')));
const sessionConfig = {
    secret: 'tobechangedsoon',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*3600*24*7,
        maxAge:1000*3600*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error   = req.flash("error");
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*----------------------------------ROUTES----------------------------------*/
app.get('/fakeUser',async(req,res)=>{
    const user = new User({
        email:"prajwalshiv.04@gmail.com",
        username:"ppo"
    });
    const newUser = await User.register(user,'p0nn1@123');
    res.send(newUser);
})
app.use("/resorts",resortsRoutes);
app.use("/resorts/:id/reviews",reviewsRoutes);
app.use("/",userRoutes);
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