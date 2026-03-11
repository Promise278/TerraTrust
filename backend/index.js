require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { syncDb } = require("./models");

// Route imports
const authRoutes = require("./routes/authRoutes");
const landRoutes = require("./routes/landRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("TerraTrust API is running...");
});

const PORT = process.env.PORT || 5000;

syncDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
