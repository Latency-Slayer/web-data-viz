const express = require('express');
const router = express.Router();

const abandonocontroller = require("../controllers/abandonoController")

router.get("/buscarKPI3", function(req,res){
    abandonocontroller.buscarKPI3(req,res)
});

router.get("/pesquisaJogo/:nomeJogo", function(req,res){
    abandonocontroller.pesquisaJogo(req,res)
})

module.exports = router