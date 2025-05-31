var express = require("express");
var router = express.Router();

var hardwareController = require("../controllers/hardwareController")

router.post("/api/real-time", function (req, res) {
    hardwareController.receberDados(req,res)
});

router.get("/api/real-time", function (req, res) {
    hardwareController.enviarDados(req,res)
});

module.exports = router;