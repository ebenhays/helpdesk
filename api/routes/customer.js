const express = require("express");
const router = express.Router();
const { customerPage, PostcustomerPage } = require("../controller/customer");

router.get("/", customerPage);
router.post("/", PostcustomerPage);
module.exports = router;
