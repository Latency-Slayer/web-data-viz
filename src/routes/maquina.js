var express = require("express");
var router = express.Router();

var maquinaController = require("../controllers/maquinaController");

router.post("/cadastrar", function (req, res) {
    maquinaController.cadastrar(req, res);
})

router.post("/pesquisa", function (req, res) {
    maquinaController.pesquisa(req, res);
})

router.post("/pesquisaUsers", function (req, res) {
    maquinaController.pesquisaUsers(req, res);
})

router.get("/maquinas", function (req, res) {
    maquinaController.autenticar(req, res);
});

router.get("/usuarios", function (req, res) {
    maquinaController.autenticarUsers(req, res);
});

router.post("/cargo", function (req, res) {
    maquinaController.cargoUsers(req, res);
})

module.exports = router;