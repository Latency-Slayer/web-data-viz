const { Router } = require("express");
const ErrorHandler = require("../error/ErrorHandler.js");
const Controller = require("../controllers/AnaliticConnectionController.js");

const controller = new Controller();
const router = Router();

router.get("/analitic/daily-avarage-connections/:registerNumber/:period", controller.getDailyAverageConnectionsInPeriod);
router.get("/analitic/peak-of-connections/:registerNumber/:period", controller.getPeakOfSimultaneousConnections);
router.get("/analitic/top-game-of-period/:registerNumber/:period", controller.getTopGameOfPeriod);
router.get("/analitic/all-top-game-of-period/:registerNumber/:period", controller.getAllTopGamesOfPeriod);
router.get("/analitic/top-continents-of-period/:registerNumber/:period", controller.getTopContinentsOfPeriod);
router.get("/analitic/get-connections-variations/:registerNumber/:period", controller.getConnectionsVariation);
router.get("/analitic/get-connections-locations/:registerNumber/:period", controller.getConnectionLocations);
router.get("/analitic/get-game-variation/:registerNumber/:period", controller.getGameVariationOnPeriod);

router.use(ErrorHandler);

module.exports = router;