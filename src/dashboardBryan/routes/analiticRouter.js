const { Router } = require("express");
const ErrorHandler = require("../error/ErrorHandler.js");
const Controller = require("../controllers/AnaliticConnectionController.js");

const controller = new Controller();
const router = Router();

router.get("/analitic/daily-avarage-connections/:registerNumber/:period", controller.getDailyAverageConnectionsInPeriod);

router.use(ErrorHandler);

module.exports = router;