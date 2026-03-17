"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lands extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lands.belongsTo(models.Users, {
        foreignKey: "UserId",
        as: "owner",
      });
      Lands.belongsTo(models.Users, {
        foreignKey: "BuyerId",
        as: "buyer",
      });
      Lands.hasMany(models.Conversations, {
        foreignKey: "landId",
        as: "conversations",
      });
    }
  }
  Lands.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("available", "sold"),
        allowNull: false,
        defaultValue: "available",
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      BuyerId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Lands",
      tableName: "lands",
    },
  );
  return Lands;
};
