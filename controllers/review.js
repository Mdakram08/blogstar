const blog=require("../modules/blog");
const review=require("../modules/review");

//review post
module.exports.reviewPost=async(req,res)=>{
    let Blog=await blog.findById(req.params.id);
    let newReview=new review(req.body.review);
    newReview.author=req.user._id;
    Blog.reviews.push(newReview);
    await newReview.save();
    await Blog.save();
    req.flash("sucess","Review Added Sucessfully !");
    res.redirect(`/blog/${Blog.id}`);
}

// review delete
module.exports.reviewDelete=async(req,res)=>{
    let{id,reviewId}=req.params;
    let Blog=await blog.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("sucess","Review Deleted Sucessfully !");
    res.redirect(`/blog/${Blog.id}`);
}