var express = require('express');
var router = express.Router();

var empresacontroller = require("../controllers/empresaController")

router.get("/listar", function(req,res){
    empresacontroller.listar(req,res)
});


module.exports =  router;