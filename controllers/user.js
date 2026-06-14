const user=require("./../modules/user");
const Blog = require("./../modules/blog.js"); // Your new Blog model

//user signup Page
module.exports.signupform=(req,res)=>{
    res.render("signup.ejs");
}

// user signup route passport.js
module.exports.signup=async(req,res)=>{
     try {
      const { username, email,password } = req.body;
      const newUser =await new user({ username, email });
      const registerdUser = await user.register(newUser, password);

      req.login(registerdUser,((err)=>{
        if(err){
          return next(err)
        }
        req.flash("sucess","User Registerd Sucessfully");
        res.redirect("/blog");
      }));
    } catch (error) {
      req.flash("error",error.message);
      res.redirect("/signup");
    }
}

//user login form
module.exports.loginform=(req,res)=>{
    res.render("login.ejs");
}

//user login passport
module.exports.login=async function (req,res) {
    req.flash("sucess","Welcome back to Blogstar !");
    res.redirect("/blog");
}

//user logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next();
        }
        req.flash("sucess","You sucessfully LogedOut !");
        res.redirect("/blog");
    })
}

//profile page
module.exports.profile=async(req,res,next)=>{
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
    // 2. Access the user object from req.user
    const currentUser = req.user;
    // Query the database for all Blogs where the 'author' field matches the current user's ID.
    // req.user is an instance of the User model and has an _id property.
    const userBlogs = await Blog.find({ owner: currentUser._id }).sort({ createdAt: -1 });

    // 3. Render the profile page with both the user and their blogs
    res.render("profile", {user: currentUser,blogs: userBlogs});
}

// controllers/user.js
// controllers/user.js
module.exports.viewprofile = async (req, res, next) => {
  try {
    const profileUserId = req.params.id;

    // Find the profile owner
    const profileUser = await user.findById(profileUserId);
    const currentUser = req.user;

    if (!profileUser) {
      req.flash("error", "User not found");
      return res.redirect("/blog");
    }

    // Get all blogs created by this user
    const blogs = await Blog.find({ owner: profileUserId }).sort({
      createdAt: -1,
    });
    // Render profile page
    res.render("viewprofile", {
      profileUser,
      currentUser,
      blogs,
      currUser: req.user || null,
    });
  } catch (err) {
    next(err);
  }
};