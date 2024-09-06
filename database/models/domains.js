"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Domains extends Model {
    static associate(models) {
      // Define associations here
        Domains.belongsTo(models.clients, { foreignKey: "client_id"});
        Domains.belongsToMany(models.vendors, { through: "domainsvendors"});
        Domains.hasMany(models.domainsvendors, { as: "domsvends"});
    }
  }

  Domains.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      domain: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: true
      },
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
        references: {
          model: "clients",
          key: "id",
        }
      }
    },
    {
      sequelize,
      modelName: "domains",
      tableName: "domains"
    }
  );

  return Domains;
};


