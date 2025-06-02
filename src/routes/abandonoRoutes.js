const express = require('express');
const router = express.Router();

const abandonocontroller = require("../controllers/abandonoController")

router.get("/buscarKPI3", function(req,res){
    abandonocontroller.buscarKPI3(req,res)
});

router.get("/pesquisaJogo/:nomeJogo", function(req,res){
    abandonocontroller.pesquisaJogo(req,res)
});

// router.get("/legendaIncidente/:nomeJogo", function(req,res){
//     abandonocontroller.legendaIncidente(req,res)
// });

router.get("/listaJogos/:id_company", function(req,res){
    abandonocontroller.listaJogos(req,res)
});

router.get("/buscarKPI2", function(req,res){
    abandonocontroller.buscarKPI2(req,res)
});

router.get("/buscarKPI1/:nomeJogo", function(req,res){
    abandonocontroller.buscarKPI1(req,res)
});

router.get("/grafico1/:nomeJogo", function(req,res){
    abandonocontroller.grafico1(req,res)
});

router.get("/grafico2", function(req,res){
    abandonocontroller.grafico2(req,res)
});

module.exports = router