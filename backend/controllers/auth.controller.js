const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/connection");
const { v4: uuidv4 } = require("uuid");
const { Users } = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

async function register(req, res) {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role || typeof role !== "string") {
      return res.status(400).json({
        success: false,
        message: "fullname, email, password, and role are required",
      });
    }

    const ALLOWED_ROLES = ["landowner", "buyer"];
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    if (fullname.length < 4 || password.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "Name must be at least 4 characters and Password at least 5 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (email === "admin@gmail.com") {
      return res.status(400).json({
        success: false,
        message: "This email is reserved for administrative use.",
      });
    }

    const saltRounds = 12;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const newUser = await Users.create({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
      message: "User Registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Hardcoded Admin Login
    if (email === "admin@gmail.com" && password === "12345678") {
      const adminPayload = {
        id: "admin-uuid-static",
        name: "Administrator",
        email: "admin@gmail.com",
        role: "admin",
        isVerified: true,
        time: Date.now(),
      };

      const token = jwt.sign(adminPayload, JWT_SECRET, { expiresIn: "8h" });

      return res.status(200).json({
        success: true,
        token,
        user: adminPayload,
        message: "Admin Login successfully",
      });
    }

    const user = await Users.findOne({
      where: { email },
      attributes: [
        "id",
        "fullname",
        "email",
        "password",
        "role",
        "isVerified",
        "lastLogin",
      ],
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    await Users.update({ lastLogin: new Date() }, { where: { id: user.id } });

    const payload = {
      id: user.id,
      name: user.fullname,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      time: Date.now(),
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    return res.status(200).json({
      success: true,
      token,
      user: payload,
      message: "User Login successfully",
    });
  } catch (error) {
    console.error("Logining Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function getlandowners(req, res) {
  try {
    const supporters = await Users.findAll({
      where: {
        role: "landowner",
      },
      attributes: ["id", "fullname", "email"],
    });

    return res.status(200).json({
      success: true,
      data: supporters,
      message: "LandOwners retrieved successfully",
    });
  } catch (error) {
    console.error("Get LnadOwners Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function verifyLandowner(req, res) {
  try {
    const { userId } = req.body;
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can verify users" });
    }

    const user = await Users.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.update({ isVerified: true });

    return res.status(200).json({
      success: true,
      message: "Landowner verified successfully",
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  register,
  login,
  getlandowners,
  verifyLandowner,
};
