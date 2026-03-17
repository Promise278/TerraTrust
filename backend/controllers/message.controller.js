const { Conversations, Messages, Users, Lands } = require("../models");
const { Op } = require("sequelize");

/**
 * SEND MESSAGE
 * POST /api/messages/send
 */
async function sendMessage(req, res) {
  try {
    let { conversationId, content, text, receiverId, landId } = req.body;
    const messageContent = content || text;

    if (!messageContent) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversations.findByPk(conversationId);
    } else if (receiverId && landId) {
      // Find or create conversation for this specific land
      [conversation] = await Conversations.findOrCreate({
        where: {
          senderId: req.user.id,
          receiverId: receiverId,
          landId: landId,
        },
        defaults: {
          status: "pending",
        },
      });
      conversationId = conversation.id;
    } else {
      return res.status(400).json({
        success: false,
        message: "conversationId or (receiverId and landId) is required",
      });
    }

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Authorization check
    if (
      conversation.senderId !== req.user.id &&
      conversation.receiverId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to send messages in this conversation",
      });
    }

    const newMessage = {
      conversationId,
      senderId: req.user.id,
      receiverId:
        req.user.id === conversation.senderId
          ? conversation.receiverId
          : conversation.senderId,
      content: messageContent,
    };

    const message = await Messages.create(newMessage);

    // Emit via Socket.IO for real-time delivery
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("receiveMessage", {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        receiverId: message.receiverId,
        isRead: message.isRead,
        createdAt: message.createdAt,
        senderName: req.user.name || req.user.fullname,
      });
    }

    return res.status(201).json({
      success: true,
      data: message,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("SendMessage Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
}

/**
 * GET ALL MESSAGES IN A CONVERSATION
 * GET /api/messages/:conversationId
 */
async function getConversationMessages(req, res) {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversations.findByPk(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (
      conversation.senderId !== req.user.id &&
      conversation.receiverId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these messages",
      });
    }

    const messages = await Messages.findAll({
      where: { conversationId },
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: messages,
      message:
        messages.length === 0
          ? "No messages yet"
          : "Messages retrieved successfully",
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

/**
 * DELETE MESSAGE (OPTIONAL – owner only)
 */
async function deleteMessage(req, res) {
  try {
    const { id } = req.params;

    const message = await Messages.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.senderId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this message",
      });
    }

    await message.destroy();

    return res.status(200).json({
      success: true,
      data: message,
      message: "Message deleted successfully",
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

/**
 * START OR GET EXISTING CONVERSATION
 * POST /api/messages/conversations
 */
async function startConversation(req, res) {
  try {
    const senderId = req.user.id;
    const { receiverId, landId } = req.body;

    if (!receiverId || !landId) {
      return res.status(400).json({
        success: false,
        message: "receiverId and landId are required",
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot start a conversation with yourself",
      });
    }

    // Check if conversation already exists between these two users for this land
    const existing = await Conversations.findOne({
      where: {
        senderId,
        receiverId,
        landId,
      },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        data: existing,
        message: "Conversation already exists",
      });
    }

    const conversation = await Conversations.create({
      senderId,
      receiverId,
      landId,
    });

    return res.status(201).json({
      success: true,
      data: conversation,
      message: "Conversation created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error starting conversation",
      error: error.message,
    });
  }
}

/**
 * GET ALL CONVERSATIONS FOR CURRENT USER
 * GET /api/messages/conversations
 */
async function getUserConversations(req, res) {
  try {
    const userId = req.user.id;

    const conversations = await Conversations.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      include: [
        {
          model: Users,
          as: "sender",
          attributes: ["id", "fullname", "email"],
        },
        {
          model: Users,
          as: "receiver",
          attributes: ["id", "fullname", "email"],
        },
        {
          model: Lands,
          as: "land",
          attributes: ["id", "title", "imageUrl", "location"],
        },
        {
          model: Messages,
          as: "messages",
          attributes: ["id", "content", "senderId", "createdAt", "isRead"],
          separate: true,
          limit: 1,
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const convData = conv.toJSON();
        const unreadCount = await Messages.count({
          where: {
            conversationId: conv.id,
            receiverId: userId,
            isRead: false,
          },
        });

        const otherParty =
          conv.senderId === userId ? conv.receiver : conv.sender;

        return {
          ...convData,
          unreadCount,
          otherParty: otherParty
            ? {
                id: otherParty.id,
                name: otherParty.fullname,
                email: otherParty.email,
              }
            : null,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      data: conversationsWithUnread,
      message: "Conversations retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching conversations",
      error: error.message,
    });
  }
}

async function markMessagesAsRead(req, res) {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Messages.update(
      { isRead: true },
      {
        where: {
          conversationId,
          receiverId: userId,
          isRead: false,
        },
      },
    );

    return res
      .status(200)
      .json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * ACCEPT CONVERSATION
 * PUT /api/messages/conversations/:id/accept
 */
async function acceptConversation(req, res) {
  try {
    const { id } = req.params;
    const conversation = await Conversations.findByPk(id);

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    if (conversation.receiverId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    conversation.status = "accepted";
    await conversation.save();

    // Notify via socket
    const io = req.app.get("io");
    if (io) {
      io.to(id).emit("conversationUpdate", { id, status: "accepted" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Conversation accepted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * REJECT CONVERSATION
 * PUT /api/messages/conversations/:id/reject
 */
async function rejectConversation(req, res) {
  try {
    const { id } = req.params;
    const conversation = await Conversations.findByPk(id);

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    if (conversation.receiverId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    conversation.status = "rejected";
    await conversation.save();

    // Notify via socket
    const io = req.app.get("io");
    if (io) {
      io.to(id).emit("conversationUpdate", { id, status: "rejected" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Conversation rejected" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  sendMessage,
  getConversationMessages,
  deleteMessage,
  startConversation,
  getUserConversations,
  markMessagesAsRead,
  acceptConversation,
  rejectConversation,
};
