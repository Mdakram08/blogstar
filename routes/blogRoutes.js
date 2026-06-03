const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const isloggedIn =require("../views/auth/isaauthenticate.js");
const isowner=require("../views/auth/authBlog.js");
const blogcontroller=require("../controllers/blog.js");
const multer=require("multer");
const { storage }=require("../cloudConfiq.js");
const upload = multer({ storage });

//Home 
router.route("/")
.get((blogcontroller.home));

//all/addnew
router.route("/blog")
.get(wrapAsync(blogcontroller.allBlog))
.post(isloggedIn,upload.single('blog[image]'),wrapAsync(blogcontroller.newformpost));


//create new form
router.get("/blog/new",isloggedIn,blogcontroller.newform);

//show/delete/update
router.route("/blog/:id")
.get(wrapAsync(blogcontroller.showBlog))
.put(isloggedIn,wrapAsync(isowner),upload.single('blog[image]'),wrapAsync(blogcontroller.upadateBlog))
// .put(isloggedIn,isowner,upload.single('blog[image]'),wrapAsync(blogcontroller.upadateBlog))
.delete(isloggedIn,wrapAsync(blogcontroller.deleteBlog))

//Get route for edit
// router.get("/blog/:id/edit",isloggedIn,wrapAsync(blogcontroller.editForm));
router.get("/blog/:id/edit",isloggedIn,wrapAsync(isowner),wrapAsync(blogcontroller.editForm));

module.exports=router;

