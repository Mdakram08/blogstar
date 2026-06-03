const blog = require("../../modules/blog");

module.exports = isowner = async (req, res, next) => {
    let { id } = req.params;
    let Blog = await blog.findById(id);
    if (!Blog.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You cannot edit the Blog");
        return res.redirect("/blog");
    }
    next();
}