const { Lands, Users, Conversations, Messages } = require("../models");
const { Sequelize, Op } = require("sequelize");

async function post_lands(req, res) {
  try {
    const { title, description, location, price, status } = req.body;
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;

    if (!title || !description || !location || !price || !status || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (including an image)",
      });
    }

    // Check if user is verified
    const user = await Users.findByPk(req.user.id);
    if (!user || (!user.isVerified && user.role === "landowner")) {
      return res.status(403).json({
        success: false,
        message:
          "Your account must be verified by an admin before you can add land.",
      });
    }

    const newLand = {
      title,
      description,
      location,
      price,
      status,
      imageUrl,
      UserId: req.user.id,
    };

    const land = await Lands.create(newLand);

    return res.status(201).json({
      success: true,
      data: land,
      message: "Land/Property added successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error adding Lands",
      error: err.message,
    });
  }
}

async function seeAllLands(req, res) {
  try {
    const lands = await Lands.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "location",
        "price",
        "status",
        "imageUrl",
        "UserId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Users,
          as: "owner",
          attributes: ["id", "fullname", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (lands.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No land/property found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lands,
      message: "Land/Property retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function updatelands(req, res) {
  try {
    const { id } = req.params;
    const { title, description, location, price, status, BuyerId } = req.body;
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;

    const land = await Lands.findByPk(id);

    if (!land) {
      return res.status(404).json({
        success: false,
        message: "Land not found",
      });
    }

    if (land.UserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this property",
      });
    }

    await land.update({
      title: title || land.title,
      description: description || land.description,
      location: location || land.location,
      price: price || land.price,
      status: status || land.status,
      imageUrl: imageUrl || land.imageUrl,
      BuyerId: BuyerId || land.BuyerId,
    });

    return res.status(200).json({
      success: true,
      data: land,
      message: "Land/property updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function deletelands(req, res) {
  try {
    const { id } = req.params;
    const land = await Lands.findByPk(id);

    if (!land) {
      return res.status(404).json({
        success: false,
        message: "Land/property not found",
      });
    }

    if (land.UserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this property",
      });
    }

    await land.destroy();

    return res.status(200).json({
      success: true,
      data: land,
      message: "lands/property deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

async function getuserproperty(req, res) {
  try {
    const { userId } = req.params;

    const lands = await Lands.findAll({
      where: {
        UserId: userId,
      },
      attributes: [
        "id",
        "title",
        "description",
        "location",
        "price",
        "status",
        "imageUrl",
        "UserId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: Users,
          as: "owner",
          attributes: ["id", "fullname"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, data: lands });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  post_lands,
  seeAllLands,
  updatelands,
  deletelands,
  getuserproperty,
};
