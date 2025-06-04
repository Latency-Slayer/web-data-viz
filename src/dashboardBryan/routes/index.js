const { Router } = require("express");
const router = Router();

const realTimeRouter = require("./realTimeRouter.js");
const analiticRouter = require("./analiticRouter.js");
const errorHandler = require("../error/ErrorHandler.js");

router.use(
    realTimeRouter,
    analiticRouter
);

router.use(errorHandler);

module.exports = router;