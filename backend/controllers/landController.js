const { Land, User } = require("../models");

exports.createLand = async (req, res) => {
  try {
    const { title, description, location, price, imageUrl } = req.body;
    const land = await Land.create({
      title,
      description,
      location,
      price,
      imageUrl,
      ownerId: req.userData.userId,
    });
    res.status(201).json(land);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLands = async (req, res) => {
  try {
    const lands = await Land.findAll({
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });
    res.json(lands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLandById = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id, {
      include: [
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });
    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }
    res.json(land);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLand = async (req, res) => {
  try {
    const { title, description, location, price, imageUrl, status } = req.body;
    const land = await Land.findByPk(req.params.id);

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    if (land.ownerId !== req.userData.userId && req.userData.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await land.update({
      title,
      description,
      location,
      price,
      imageUrl,
      status,
    });
    res.json(land);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLand = async (req, res) => {
  try {
    const land = await Land.findByPk(req.params.id);

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    if (land.ownerId !== req.userData.userId && req.userData.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await land.destroy();
    res.json({ message: "Land deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
