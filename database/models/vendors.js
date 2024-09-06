"use strict";
const { Model } = require("sequelize");
const constants = require("../../helpers/constants");

module.exports = (sequelize, DataTypes) => {
  class Vendors extends Model {
    static associate(models) {
      // Define associations here
      Vendors.belongsToMany(models.domains, { through: "domainsvendors"});
      Vendors.hasMany(models.domainsvendors, {as: "domsvends"});
    }
  }

  Vendors.init(
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
      },
      status: {
        type: DataTypes.ENUM,
        values: [constants.ACTIVE, constants.INACTIVE],
        allowNull: true,
        unique: false
      },
      google_spreadsheet_link: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
      }
    },
    {
      sequelize,
      modelName: "vendors",
      tableName: "vendors"
    }
  );

  return Vendors;
};


