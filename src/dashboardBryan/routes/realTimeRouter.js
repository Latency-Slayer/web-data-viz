const { Router } = require("express");
const ErrorHandler = require("../error/ErrorHandler.js");
const Controller = require("../controllers/RealTimeConnectionController.js");

const controller = new Controller();
const router = Router();

router.use(ErrorHandler);

router.post("/real-time/receive-data", controller.receiveServerConnectionsData);
router.get("/real-time/quantity-connections/:registerNumber", controller.getQuantConnections);
router.get("/real-time/quantity-active-servers/:registerNumber", controller.getQuantActiveServers);
router.get("/real-time/top-games/:registerNumber", controller.getTopGamesOfMoment);
router.get("/real-time/top-continents/:registerNumber", controller.getTopContinents);

module.exports = router;