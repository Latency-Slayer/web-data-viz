var express = require("express");
var router = express.Router();

var processController = require("../controllers/processController")

router.post("/api/real-time", function (req, res) {
    processController.receberProcessos(req,res)
});

router.get("/api/real-time", function (req, res) {
    processController.enviarProcessos(req,res)
});

module.exports = router;