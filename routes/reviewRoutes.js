const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const isReviewOwner=require("../views/auth/isReviewOwner.js");
const isloggedIn=require("../views/auth/isaauthenticate.js");
const reviewcontroller=require("../controllers/review.js");

//review post
router.post("/blog/:id/reviews",isloggedIn,wrapAsync(reviewcontroller.reviewPost));

//review delete
router.delete("/blog/:id/reviews/:reviewId",isloggedIn,isReviewOwner,wrapAsync(reviewcontroller.reviewDelete));

module.exports=router;

