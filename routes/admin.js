var express = require("express");
var router = express.Router();
var { protect } = require("../utill/jwtAuth");
var User = require("../model/user.model");
const {
  validatePagination,
  validatePermission,
} = require("../validation/adminValidation");

router.get("/users", validatePagination, async (req, res) => {
  let { page, pageSize } = req.query;
  page = parseInt(page, 10) || 1; // Default to page 1 if not specified
  pageSize = parseInt(pageSize, 10) || 10; // Default to 10 items per page if not specified

  try {
    const users = await User.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("-password"); // Exclude passwords from the result set
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: page,
      pageSize: pageSize,
      users: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* add-permission. */
router.put(
  "/add-permission/:userId",
  protect("admin"),
  validatePermission,
  async (req, res) => {
    const { permission, value } = req.body;
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the same permission already exists with the same value
      if (user.permissions[permission] === value) {
        return res
          .status(409)
          .json({
            message: `User already has '${permission}' permission set to '${value}'`,
          });
      }

      // Set or update the permission
      user.permissions[permission] = value;
      await user.save();
      res.status(200).json({
        message: `Permission '${permission}' updated to '${value}' for user.`,
        permissions: user.permissions,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


router.delete(
  "/remove-permission/:userId",
  protect("admin"),
  validatePermission,  // Reusing the existing validation which ensures that 'permission' is provided
  async (req, res) => {
    const { permission } = req.body;
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the permission exists
      if (user.permissions.hasOwnProperty(permission)) {
        // Remove the permission
        delete user.permissions[permission];
        await user.save();
        res.status(200).json({
          message: `Permission '${permission}' removed from user.`,
          permissions: user.permissions
        });
      } else {
        res.status(404).json({ message: `Permission '${permission}' not found for this user.` });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
