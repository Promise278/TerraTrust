const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getOwnerDashboard,
  getBuyerDashboard,
  getAllUsers,
  getAllLands,
} = require("../controllers/dashboard.controller");
const { readLimiter } = require("../middleware/ratelimit");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/admin", authMiddleware, readLimiter, getAdminStats);
router.get("/owner", authMiddleware, readLimiter, getOwnerDashboard);
router.get("/buyer", authMiddleware, readLimiter, getBuyerDashboard);
router.get("/admin/users", authMiddleware, readLimiter, getAllUsers);
router.get("/admin/lands", authMiddleware, readLimiter, getAllLands);

module.exports = router;
