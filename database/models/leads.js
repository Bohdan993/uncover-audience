"use strict";
const { Model } = require("sequelize");
const constants = require("../../helpers/constants");

module.exports = (sequelize, DataTypes) => {
  class Leads extends Model {
    static associate(models) {
      // Define associations here
      Leads.belongsTo(models.domainsvendors, { foreignKey: "domain_vendor_id" });
    }
  }

  Leads.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      domain_vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: "domainsvendors",
          key: "id",
        }
      },
      phone: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false,
        validate: {
          isEmail: true
        }
      },
      browser: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
      },
      gender: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
      },
      age: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: false,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.ENUM,
        values: [constants.NEW, constants.APPROVED, constants.DECLINE],
        allowNull: true,
        unique: false
      }
    },
    {
      sequelize,
      modelName: "leads",
      tableName: "leads"
    }
  );

  return Leads;
};


