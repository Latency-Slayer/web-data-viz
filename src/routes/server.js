var express = require("express");
var router = express.Router();

var serverController = require("../controllers/serverController");

router.post("/register", function (req, res) {
    serverController.registerServer(req, res);
})

router.get("/get/components", (req, res) => {
    serverController.getServerComponentsData(req, res);
})

module.exports = router;