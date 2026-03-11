const { User, Land, Message, Conversation } = require("../models");
const { Op } = require("sequelize");

exports.getAdminStats = async (req, res) => {
  try {
    if (req.userData.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const totalUsers = await User.count();
    const totalLands = await Land.count();
    const totalBuyers = await User.count({ where: { role: "buyer" } });
    const totalOwners = await User.count({ where: { role: "landowner" } });

    const recentLands = await Land.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "owner", attributes: ["name"] }],
    });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "email", "role"],
    });

    res.json({
      stats: { totalUsers, totalLands, totalBuyers, totalOwners },
      recentLands,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const lands = await Land.findAll({ where: { ownerId: userId } });
    const conversations = await Conversation.findAll({
      where: { landownerId: userId },
      include: [
        { model: User, as: "buyer", attributes: ["name", "email"] },
        {
          model: Message,
          as: "messages",
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    res.json({ lands, conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBuyerDashboard = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const conversations = await Conversation.findAll({
      where: { buyerId: userId },
      include: [
        { model: User, as: "landowner", attributes: ["name", "email"] },
        {
          model: Message,
          as: "messages",
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    // Also get all available lands for the buyer
    const availableLands = await Land.findAll({
      where: { status: "available" },
    });

    res.json({ conversations, availableLands });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
