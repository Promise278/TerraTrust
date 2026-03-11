const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Land = sequelize.define("Land", {
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
});

module.exports = Land;
