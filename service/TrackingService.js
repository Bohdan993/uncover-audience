const { Op } = require("sequelize");
const { 
  domains: Domain,
  domainsvendors: DomainVendor
} = require("../database/models/index");

class TrackingServise {
  async getAllDomainPixels(domainId){
    let result = [];

    result = await DomainVendor.findAll({
      attributes: [
        "id", "domain_id", "vendor_id", 
        "vendor_params", "status", "total_records", 
        "name"
      ],
      where: {
        domain_id: domainId,
        status: {
          [Op.eq]: "On"
        }
      },
      include: [
        {
          model: Domain,
          attributes: ["id", "domain", "client_id"]
        }
      ]
    });

    return result.map((el) => el?.toJSON());
  }
}

module.exports = {
  trackingServise: new TrackingServise()
}