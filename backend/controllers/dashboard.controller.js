const { Users, Lands, Messages, Conversations } = require("../models");
const { Op } = require("sequelize");

exports.getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const totalUsers = await Users.count();
    const totalLands = await Lands.count();
    const totalBuyers = await Users.count({ where: { role: "buyer" } });
    const totalOwners = await Users.count({ where: { role: "landowner" } });

    const recentLands = await Lands.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: Users, as: "owner", attributes: ["fullname"] }],
    });

    const recentUsers = await Users.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "fullname", "email", "role", "isVerified"],
    });

    res.json({
      stats: { totalUsers, totalLands, totalBuyers, totalOwners },
      recentLands: recentLands.map((l) => ({
        id: l.id,
        title: l.title,
        location: l.location,
        owner: l.owner ? { name: l.owner.fullname } : { name: "Unknown" },
      })),
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        name: u.fullname,
        email: u.email,
        role: u.role,
        isVerified: u.isVerified,
      })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const lands = await Lands.findAll({ where: { UserId: userId } });
    const conversations = await Conversations.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      include: [
        { model: Users, as: "sender", attributes: ["id", "fullname", "email"] },
        {
          model: Users,
          as: "receiver",
          attributes: ["id", "fullname", "email"],
        },
        {
          model: Lands,
          as: "land",
          attributes: ["id", "title"],
        },
      ],
    });

    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Messages.findOne({
          where: { conversationId: conv.id },
          order: [["createdAt", "DESC"]],
        });

        const otherUser =
          conv.senderId === userId ? conv.receiver : conv.sender;

        return {
          id: conv.id,
          landId: conv.landId,
          landTitle: conv.land ? conv.land.title : "Unknown Property",
          buyer: {
            id: otherUser ? otherUser.id : null,
            name: otherUser ? otherUser.fullname : "Unknown",
            email: otherUser ? otherUser.email : "",
          },
          messages: lastMessage
            ? [{ text: lastMessage.content, createdAt: lastMessage.createdAt }]
            : [],
        };
      }),
    );

    res.json({ lands, conversations: formattedConversations });
  } catch (error) {
    console.error("Owner dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBuyerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversations.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      include: [
        { model: Users, as: "sender", attributes: ["id", "fullname", "email"] },
        {
          model: Users,
          as: "receiver",
          attributes: ["id", "fullname", "email"],
        },
      ],
    });

    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Messages.findOne({
          where: { conversationId: conv.id },
          order: [["createdAt", "DESC"]],
        });

        const otherUser =
          conv.senderId === userId ? conv.receiver : conv.sender;

        return {
          id: conv.id,
          landowner: {
            name: otherUser ? otherUser.fullname : "Unknown",
            id: otherUser ? otherUser.id : null,
          },
          messages: lastMessage
            ? [{ text: lastMessage.content, createdAt: lastMessage.createdAt }]
            : [],
        };
      }),
    );

    const availableLands = await Lands.findAll({
      where: { status: "available" },
      include: [{ model: Users, as: "owner", attributes: ["fullname", "id"] }],
    });

    res.json({
      conversations: formattedConversations,
      availableLands: availableLands.map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        location: l.location,
        price: l.price,
        status: l.status,
        imageUrl: l.imageUrl,
        owner: l.owner ? { name: l.owner.fullname, id: l.owner.id } : null,
      })),
    });
  } catch (error) {
    console.error("Buyer dashboard error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await Users.findAll({
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "fullname",
        "email",
        "role",
        "isVerified",
        "createdAt",
      ],
    });

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLands = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const lands = await Lands.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: Users, as: "owner", attributes: ["fullname", "email"] },
        { model: Users, as: "buyer", attributes: ["fullname", "email"] },
      ],
    });

    res.json({ success: true, data: lands });
  } catch (error) {
    console.error("Get all lands error:", error);
    res.status(500).json({ message: error.message });
  }
};
