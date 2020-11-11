const isLoggedIn = (req,res,next)=>{
    console.log("**********",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error',"You have to login");
        res.redirect("/login");
    }else{
        next();
    }
}
module.exports = isLoggedIn;