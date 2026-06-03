module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must first Login!");
        return res.redirect("/login");
    }
    if (!req.user.isAdmin) {
        req.flash("error", "Access Denied! Admins only.");
        return res.redirect("/blog");
    }
    next();
};
