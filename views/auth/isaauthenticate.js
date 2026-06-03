module.exports=loggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must first Login !");
        return res.redirect("/login");
    }
    next();
}

