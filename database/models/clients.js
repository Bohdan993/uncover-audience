"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    static associate(models) {
      // Define associations here
      Clients.hasMany(models.domains, { as: "domains" });
    }
  }

  Clients.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: true
      },
      website: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: true
      }
    },
    {
      sequelize,
      modelName: "clients",
      tableName: "clients"
    }
  );

  return Clients;
};


