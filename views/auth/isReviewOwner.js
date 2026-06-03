const review = require("../../modules/review");

module.exports=isReviewOwner=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let reviews=await review.findById(reviewId);
    if(!reviews.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of the review");
        return res.redirect(`/blog/${id}`);
    }
    next();
}