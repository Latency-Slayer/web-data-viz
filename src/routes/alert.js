var express = require("express");
var router = express.Router();

var alertController = require("../controllers/alertController");

router.post("/registerAlert", function (req, res) {
    alertController.registerAlert(req, res)
})

router.get("/getAlerts", function (req, res) {
    alertController.getAlerts(req, res)
})

module.exports = router;