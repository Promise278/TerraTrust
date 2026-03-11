const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/admin", dashboardController.getAdminStats);
router.get("/owner", dashboardController.getOwnerDashboard);
router.get("/buyer", dashboardController.getBuyerDashboard);

module.exports = router;
