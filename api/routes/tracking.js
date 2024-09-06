const { Router } = require("express");
const router = Router();
const { query } = require("express-validator");
const { trackingController } = require("../../controllers/TrackingController");

router.get(
  "/get-domain-pixels",
  query("id")
    .isString()
    .isUUID("4"),
  trackingController.getAllDomainPixels
);

module.exports = router;
