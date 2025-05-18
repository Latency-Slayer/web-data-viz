const { Router } = require("express");
const ErrorHandler = require("../error/ErrorHandler.js");
const Controller = require("../controllers/RealTimeConnectionController.js");

const controller = new Controller();
const router = Router();

router.use(ErrorHandler);

router.post("/real-time/receive-data", controller.receiveServerConnectionsData);
router.get("/real-time/quantity-connections/:registerNumber", controller.getQuantConnections)

module.exports = router;