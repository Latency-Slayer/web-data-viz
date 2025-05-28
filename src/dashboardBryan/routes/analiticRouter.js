const { Router } = require("express");
const ErrorHandler = require("../error/ErrorHandler.js");
const Controller = require("../controllers/AnaliticConnectionController.js");

const controller = new Controller();
const router = Router();

router.get("/analitic/daily-avarage-connections/:registerNumber/:period", controller.getDailyAverageConnectionsInPeriod);
router.get("/analitic/peak-of-connections/:registerNumber/:period", controller.getPeakOfSimultaneousConnections);
router.get("/analitic/top-game-of-period/:registerNumber/:period", controller.getTopGameOfPeriod);

router.use(ErrorHandler);

module.exports = router;