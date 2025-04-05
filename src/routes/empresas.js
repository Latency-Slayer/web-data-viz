var express = require('express');
var router = express.Router();

var empresacontroller = require("../controllers/empresaController")

router.get("/listar", function(req,res){
    empresacontroller.listar(req,res)
});

router.get("/getCountry", function(req,res){
    empresacontroller.getCountry(req,res)
});

router.post("/registerCompanyAndUser", function (req, res){
    empresacontroller.registerCompanyAndUser(req, res)
})

module.exports =  router;