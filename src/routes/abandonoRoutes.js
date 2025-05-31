const express = require('express');
const router = express.Router();

const abandonocontroller = require("../controllers/abandonoController")

router.get("/buscarKPI3", function(req,res){
    abandonocontroller.buscarKPI3(req,res)
});

module.exports = router