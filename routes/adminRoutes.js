const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const isAdmin = require("../views/auth/isAdmin.js");
const adminController = require("../controllers/admin.js");

// Dashboard
router.get("/admin", isAdmin, wrapAsync(adminController.dashboard));

// Users
router.get("/admin/users", isAdmin, wrapAsync(adminController.allUsers));
router.delete("/admin/users/:id", isAdmin, wrapAsync(adminController.deleteUser));
router.post("/admin/users/:id/toggle-admin", isAdmin, wrapAsync(adminController.toggleAdmin));

// Blogs
router.get("/admin/blogs", isAdmin, wrapAsync(adminController.allBlogs));
router.delete("/admin/blogs/:id", isAdmin, wrapAsync(adminController.deleteBlog));

module.exports = router;
