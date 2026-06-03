const Blog = require("../modules/blog.js");
const User = require("../modules/user.js");
const Review = require("../modules/review.js");

// GET /admin — Dashboard stats
module.exports.dashboard = async (req, res) => {
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();

    const recentBlogs = await Blog.find()
        .sort({ _id: -1 })
        .limit(5)
        .populate("owner");

    const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5);

    res.render("admin/dashboard.ejs", {
        totalBlogs,
        totalUsers,
        totalReviews,
        recentBlogs,
        recentUsers,
    });
};

// GET /admin/users — All users
module.exports.allUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.render("admin/users.ejs", { users });
};

// DELETE /admin/users/:id — Delete a user and their blogs/reviews
module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.equals(id)) {
        req.flash("error", "You cannot delete your own admin account!");
        return res.redirect("/admin/users");
    }

    // Delete all blogs owned by this user
    const userBlogs = await Blog.find({ owner: id });
    for (let b of userBlogs) {
        await Review.deleteMany({ _id: { $in: b.reviews } });
        await Blog.findByIdAndDelete(b._id);
    }

    await User.findByIdAndDelete(id);
    req.flash("sucess", "User and their content deleted successfully!");
    res.redirect("/admin/users");
};

// POST /admin/users/:id/toggle-admin — Toggle admin role
module.exports.toggleAdmin = async (req, res) => {
    const { id } = req.params;

    if (req.user._id.equals(id)) {
        req.flash("error", "You cannot change your own admin status!");
        return res.redirect("/admin/users");
    }

    const targetUser = await User.findById(id);
    targetUser.isAdmin = !targetUser.isAdmin;
    await targetUser.save();

    const status = targetUser.isAdmin ? "granted admin" : "removed admin from";
    req.flash("sucess", `Successfully ${status} user ${targetUser.username}!`);
    res.redirect("/admin/users");
};

// GET /admin/blogs — All blogs
module.exports.allBlogs = async (req, res) => {
    const { category } = req.query;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    const blogs = await Blog.find(filter).sort({ _id: -1 }).populate("owner");
    res.render("admin/blogs.ejs", { blogs, query: category });
};

// DELETE /admin/blogs/:id — Delete any blog
module.exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    await Review.deleteMany({ _id: { $in: blog.reviews } });
    await Blog.findByIdAndDelete(id);
    req.flash("sucess", "Blog deleted successfully!");
    res.redirect("/admin/blogs");
};
