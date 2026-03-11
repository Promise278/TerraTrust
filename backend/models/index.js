const sequelize = require("./config/database");
const User = require("./User");
const Land = require("./Land");
const Conversation = require("./Conversation");
const Message = require("./Message");

// User <-> Land (One-to-Many)
User.hasMany(Land, { foreignKey: "ownerId", as: "lands" });
Land.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User <-> Conversation (Many-to-Many or just tracked roles)
Conversation.belongsTo(User, { as: "buyer", foreignKey: "buyerId" });
Conversation.belongsTo(User, { as: "landowner", foreignKey: "landownerId" });

// Conversation <-> Message (One-to-Many)
Conversation.hasMany(Message, { foreignKey: "conversationId", as: "messages" });
Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

const syncDb = async () => {
  try {
    // In a real production app, use migrations.
    // sync({ alter: true }) is fine for rapid development.
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

module.exports = {
  User,
  Land,
  Conversation,
  Message,
  syncDb,
};
