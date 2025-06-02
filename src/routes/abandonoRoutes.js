const express = require('express');
const router = express.Router();

const abandonocontroller = require("../controllers/abandonoController")

router.get("/buscarKPI3", function(req,res){
    abandonocontroller.buscarKPI3(req,res)
});

router.get("/pesquisaJogo/:nomeJogo", function(req,res){
    abandonocontroller.pesquisaJogo(req,res)
});

router.get("/listaJogos/:id_company", function(req,res){
    abandonocontroller.listaJogos(req,res)
});

router.get("/buscarKPI2", function(req,res){
    abandonocontroller.buscarKPI2(req,res)
});

router.get("/dados_abandono/:nomeJogo", function(req,res){
    abandonocontroller.dados_abandono(req,res);
});

router.get("/dados_abandono_kpi/:nomeJogo", function(req,res){
    abandonocontroller.dados_abandono_kpi(req,res);
});

router.get("/grafico2", function(req,res){
    abandonocontroller.grafico2(req,res);
});

module.exports = router