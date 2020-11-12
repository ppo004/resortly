const express       = require("express");
const passport = require("passport");
const router        = express.Router();
const User        = require("../modules/user");

router.get("/register",(req,res)=>{
    res.render("user/register");
});
router.post("/register",async(req,res)=>{
    try{
        const {firstname,lastname,username,password,email} = req.body;
        const user = new User({
            email,
            username,
            firstname,lastname
        });
        const newUser = await User.register(user,password);
        console.log(newUser);
        req.logIn(newUser,err=>{
            if(err) return next(err);
            req.flash('success',`${user.username} registered`);
            res.redirect("/resorts");
        });
    }
    catch(error){
        req.flash('error',error.message);
        res.redirect("/register");
    }
});
router.get("/login",(req,res)=>{
    
    res.render("user/login")
})
router.post("/login",passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),(req,res)=>{
    req.flash('success','Welcome back');
    res.redirect(req.session.returnTo || "/resorts");
});
router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash('success',"Goodbye");
    res.redirect("/resorts");
})
module.exports = router;