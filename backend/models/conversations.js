"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conversations.hasMany(models.Messages, {
        foreignKey: "conversationId",
        as: "messages",
        onDelete: "CASCADE",
      });
      Conversations.belongsTo(models.Users, {
        foreignKey: "senderId",
        as: "sender",
      });
      Conversations.belongsTo(models.Users, {
        foreignKey: "receiverId",
        as: "receiver",
      });

      Conversations.belongsTo(models.Lands, {
        foreignKey: "landId",
        as: "land",
      });
    }
  }
  Conversations.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      landId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Conversations",
      tableName: "conversations",
    },
  );
  return Conversations;
};
