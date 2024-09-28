const { Router } = require("express");
const router = Router();
const { query } = require("express-validator");
const { trackingController } = require("../../controllers/TrackingController");
const { trackingControllerAirtable } = require("../../controllers/TrackingControllerAirtable");

router.get(
  "/get-domain-pixels",
  query("id")
    .trim()
    .isString()
    .notEmpty()
    .isUUID("4"),
  trackingController.getAllDomainPixels
);

router.get(
  "/get-pixels",
  query("uaid")
    .trim()
    .isString()
    .notEmpty()
    .custom(value => {
      if(!/^ua-[a-z0-9]{8}-[0-9]{4}-[a-z0-9]{4}-[a-z0-9]{14}$/.test(value)) {
        throw new Error("uaid must math pattern /^ua-[a-z0-9]{8}-[0-9]{4}-[a-z0-9]{4}-[a-z0-9]{14}$/");
      }
      return true;
    }),
  trackingControllerAirtable.getAllDomainPixels
);

module.exports = router;
