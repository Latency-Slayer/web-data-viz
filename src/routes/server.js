var express = require("express");
var router = express.Router();

var serverController = require("../controllers/serverController");

router.post("/register", function (req, res) {
    serverController.registerServer(req, res);
})

router.get("/get/components", (req, res) => {
    serverController.getServerComponentsData(req, res);
})

router.get("/:tag-name", (req, res) => {
    serverController.getServerBytagName(req.params.tagName, res);
})

router.get("/listarServidores", (req, res) => {
    serverController.listarServer(req, res);
});

router.get("/getLimitComponent", (req, res) => {
    serverController.getLimitComponent(req, res);
});

module.exports = router;