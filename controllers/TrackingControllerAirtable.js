const APIError = require("../exeptions/api-error");
const { trackingServiseAirtable } = require("../service/TrackingServiceAirtable");
const { validationResult} = require("express-validator");
const { domainServise } = require("../service/DomainServise");

class TrackingControllerAirtable {
    async getAllPixels(req, res, next){
        try {
            return res.json({"status": "ok", "data": []});
        } catch(err) {
            return next(err);
        }
    }

    async getAllDomainPixels(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw APIError.ValidationError("Validation Error", errors.array());
            }

            const {
                id
            } = req.query;

            let pixelsData = [];
            pixelsData = await trackingServiseAirtable.getAllDomainPixels(id);

            if(!pixelsData.length) {
                throw APIError.ValidationError("Not Found");
            }

            const isValidDomain = domainServise.validateDomain({
                "domain": pixelsData?.[0]?.domain,
                "expectedDomain": req.get("origin")
            });

            if(!isValidDomain) {
                throw APIError.ValidationError("Validation Error", `${req.get("origin") ? req.get("origin").replace(/(^\w+:|^)|\//gi, '') : req.hostname} is not a valid domain`);
            }

            return res.json({
                "status": "ok", 
                "data": pixelsData
            });
        } catch(err) {
            return next(err);
        }
    }
}


module.exports = {
    trackingControllerAirtable: new TrackingControllerAirtable()
}