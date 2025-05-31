const express = require('express');
const router = express.Router();

const abandonocontroller = require()

router.get("/buscarKPI3", function(req,res){
    abandonocontroller.buscarKPI3(req,res)
});