const express = require("express");
const router = express.Router();
const {
  LoginPage,
  RegisterPage,
  RegisterUser,
  PostLoginUser,
  ChangeUserPassword,
  postChangeUserPassword
} = require("../controller/User");

const {
  ADMIN_REGISTER,
  ADMIN_CHANGE_PASSWORD
} = require("../../commons/constants");

router.get("/", LoginPage);
router.post("/", PostLoginUser);
router.get(ADMIN_REGISTER, RegisterPage);
router.post(ADMIN_REGISTER, RegisterUser);
router.get(ADMIN_CHANGE_PASSWORD, ChangeUserPassword);
router.post(ADMIN_CHANGE_PASSWORD, postChangeUserPassword);

module.exports = router;
