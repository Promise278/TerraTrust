const express = require("express");
const {
  register,
  login,
  getlandowners,
  verifyLandowner,
} = require("../controllers/auth.controller");
const { authLimiter } = require("../middleware/ratelimit");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/seelandowners", authMiddleware, getlandowners);
router.post("/verify-landowner", authMiddleware, verifyLandowner);

module.exports = router;
