"use strict";
const { Model } = require("sequelize");
const constants = require("../../helpers/constants");

module.exports = (sequelize, DataTypes) => {
  class DomainsVendors extends Model {
    static associate(models) {
      // Define associations here
      DomainsVendors.belongsTo(models.domains, { foreignKey: "domain_id" });
      DomainsVendors.belongsTo(models.vendors, { foreignKey: "vendor_id" });
      DomainsVendors.hasMany(models.leads, { as: "leads" });
    }
  }

  DomainsVendors.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      domain_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
        references: {
          model: "domains",
          key: "id",
        }
      },
      vendor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
        references: {
          model: "vendors",
          key: "id",
        }
      },
      vendor_params: {
        type: DataTypes.JSONB,
        allowNull: true,
        unique: false,
        defaultValue: JSON.stringify({})
      },
      status: {
        type: DataTypes.ENUM,
        values: [constants.ON, constants.OFF],
        allowNull: true,
        unique: false
      },
      total_records: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 0
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
      }
    },
    {
      sequelize,
      modelName: "domainsvendors",
      tableName: "domains_vendors"
    }
  );

  return DomainsVendors;
};


