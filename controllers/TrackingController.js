const APIError = require("../exeptions/api-error");
const { trackingServise } = require("../service/TrackingService");
const { validationResult} = require("express-validator");
const { domainServise } = require("../service/DomainServise");

class TrackingController {
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
            pixelsData = await trackingServise.getAllDomainPixels(id);

            if(!pixelsData.length) {
                throw APIError.ValidationError("Not Found");
            }

            const isValidDomain = domainServise.validateDomain({
                "domain": pixelsData?.domain?.domain,
                "expectedDomain": req.hostname
            });

            if(!isValidDomain) {
                throw APIError.ValidationError("Validation Error", `${req.hostname} is not a valid domain`);
            }

            return res.json({
                "status": "ok", 
                "data": pixelsData.map(el => ({
                        name: el?.name,
                        url: el?.vendor_params?.script_url,
                        external_vars: typeof el?.vendor_params?.has_global_attrs === "boolean" ? el?.vendor_params?.has_global_attrs : false,
                        attrs: Object.fromEntries(
                                Object.entries(el?.vendor_params || {})
                                        .filter(el => {
                                            return !(["script_url", "has_global_attrs"].includes(el[0]))
                                        })
                            )
                    }))});
        } catch(err) {
            return next(err);
        }
    }
}



module.exports = {
    trackingController: new TrackingController()
}