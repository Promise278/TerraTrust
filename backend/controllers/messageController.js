const { Message, Conversation, User } = require("../models");
const { Op } = require("sequelize");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.userData.userId;

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { buyerId: senderId, landownerId: receiverId },
          { buyerId: receiverId, landownerId: senderId },
        ],
      },
    });

    if (!conversation) {
      // Create new conversation
      // We assume the one initiating is a buyer or landowner
      // For simplicity, let's assign roles based on who is who
      // In a real app, you might want to validate roles here
      conversation = await Conversation.create({
        buyerId: req.userData.role === "buyer" ? senderId : receiverId,
        landownerId: req.userData.role === "landowner" ? senderId : receiverId,
      });
    }

    const message = await Message.create({
      text,
      senderId,
      conversationId: conversation.id,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ buyerId: userId }, { landownerId: userId }],
      },
      include: [
        { model: User, as: "buyer", attributes: ["id", "name", "email"] },
        { model: User, as: "landowner", attributes: ["id", "name", "email"] },
        {
          model: Message,
          as: "messages",
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.findAll({
      where: { conversationId },
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
