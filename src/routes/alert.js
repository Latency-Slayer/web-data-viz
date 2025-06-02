var express = require("express");
var router = express.Router();

var alertController = require("../controllers/alertController");

router.post("/registerAlert", function (req, res) {
    alertController.registerAlert(req, res)
})

router.get("/getAlerts/:motherboard", function (req, res) {
    alertController.getAlerts(req, res)
})

router.get("/getAlertsPorDia/:motherboard", function (req, res) {
    alertController.getAlertsPorDia(req, res)
})

module.exports = router;