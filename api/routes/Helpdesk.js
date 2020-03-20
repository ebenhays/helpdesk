const express = require("express");
const router = express.Router();
const { mainPage } = require("../controller/Helpdesk");

router.get("/", mainPage);

module.exports = router;
