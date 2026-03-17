const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { readLimiter, writeLimiter } = require("../middleware/ratelimit");
const { post_lands, updatelands, deletelands, seeAllLands, getuserproperty } = require("../controllers/land.controller");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

// Reads — generous limit (100/min)
router.get("/seealllands", authMiddleware, readLimiter, seeAllLands);
router.get("/user/:userId", authMiddleware, readLimiter, getuserproperty)


// Writes — stricter limit (20/min) to prevent spam
router.post("/createlands", authMiddleware, writeLimiter, upload.single("image"), post_lands);
router.put("/updateland/:id", authMiddleware, writeLimiter, upload.single("image"), updatelands);
router.delete(
  "/deleteland/:id",
  authMiddleware,
  writeLimiter,
  deletelands,
);

module.exports = router;
