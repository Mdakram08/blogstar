const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const usercontroller=require("../controllers/user.js");

//signup post and getform
router.route("/signup")
.get(usercontroller.signupform)
.post(usercontroller.signup);

//login post and getform
router.route("/login")
.get(usercontroller.loginform)
.post(
  passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
  }),  
  usercontroller.login
);

//logout
router.get("/logout",usercontroller.logout);

//profile
router.get("/profile",usercontroller.profile);

//view profile
router.get("/blog/:id/profile",usercontroller.viewprofile);

module.exports=router;