var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.get("/getRole", function(req,res){
    usuarioController.getRole(req,res)
});

router.post("/registerUser", function (req, res) {
    usuarioController.registerUser(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
});

module.exports = router;