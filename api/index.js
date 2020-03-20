const express = require("express");
const router = express.Router();
const { User, Helpdesk, Customer } = require("./routes.js");
const { ADMIN_LOGIN, HELPDESK } = require("../commons/constants");
router.use(ADMIN_LOGIN, User);
router.use(HELPDESK.MAIN, Helpdesk);
router.use("/", Customer);

module.exports = router;
