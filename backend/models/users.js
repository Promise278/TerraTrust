"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Lands, {
        foreignKey: "UserId",
        // as: "lands"
      });
      // reverse of Conversations
      Users.hasMany(models.Conversations, {
        foreignKey: "senderId",
        as: "sentConversations",
      });
      Users.hasMany(models.Conversations, {
        foreignKey: "receiverId",
        as: "receivedConversations",
      });

      // reverse of Messages
      Users.hasMany(models.Messages, {
        foreignKey: "senderId",
        as: "sentMessages",
      });
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("landowner", "buyer", "admin"),
        allowNull: false,
        defaultValue: "buyer",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
    },
  );
  return Users;
};
