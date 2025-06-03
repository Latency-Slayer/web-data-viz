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

router.get("/getAlertsPerServer", (req, res) => {
    serverController.getAlertsPerServer(req, res);
});

router.get("/getRelatorioDeChamadosDoMesPassado", (req, res) => {
    serverController.getRelatorioDeChamadosDoMesPassado(req, res);
})

router.get("/getChamadosSemResponsavel", (req, res) => {
    serverController.getChamadosSemResponsavel(req, res);
});

router.get("/getLimitComponent/:motherboardid", (req, res) => {
    serverController.getLimitComponent(req.params.motherboardid, res);
});

router.get("/getTopTresServersComMaisOcorrencias", (req, res) => {
    serverController.getTopTresServersComMaisOcorrencias(req, res);
});


module.exports = router;