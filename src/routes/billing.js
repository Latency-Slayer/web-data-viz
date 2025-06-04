var express = require("express");
var router = express.Router();

var billingController = require("../controllers/billingController");

router.get("/getCustoAWS", function (req, res) {
    billingController.pegarCustosAWS(req, res)
})

router.get("/getCustoAWSForecast", function (req, res) {
    billingController.pegarCustosAWSForecast(req, res)
})

module.exports = router;