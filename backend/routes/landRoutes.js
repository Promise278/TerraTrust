const express = require("express");
const router = express.Router();
const landController = require("../controllers/landController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", landController.getAllLands);
router.get("/:id", landController.getLandById);

// Protected routes
router.post("/", authMiddleware, landController.createLand);
router.patch("/:id", authMiddleware, landController.updateLand);
router.delete("/:id", authMiddleware, landController.deleteLand);

module.exports = router;
