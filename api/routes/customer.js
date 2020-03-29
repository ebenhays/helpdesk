const express = require("express");
const router = express.Router();
const { customerPage, PostcustomerPage } = require("../controller/customer");
const { check } = require("express-validator");
router.get("/", customerPage);
router.post(
  "/",
  [
    check("name", "Please enter your name").notEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("service", "Please choose a service").notEmpty(),
    check("message", "Please enter a message").notEmpty(),
    check("phone", "Phone number is invalid")
      .isNumeric()
      .notEmpty()
      .isLength({ min: 10 })
  ],
  PostcustomerPage
);
module.exports = router;
