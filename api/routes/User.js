const express = require("express");
const router = express.Router();
const {
  LoginPage,
  RegisterPage,
  RegisterUser,
  PostLoginUser,
  ChangeUserPassword,
  postChangeUserPassword,
  postLogout
} = require("../controller/User");
const {
  ADMIN_REGISTER,
  ADMIN_CHANGE_PASSWORD,
  ADMIN_LOGOUT
} = require("../../commons/constants");

const isAuth = require("../middleware/is-auth");
const { check } = require("express-validator");
router.get("/", LoginPage);
router.post(
  "/",
  [
    check("email", "Please enter a valid email address").isEmail(),
    check("userpassword", "Password is required").notEmpty()
  ],
  PostLoginUser
);
router.get(ADMIN_LOGOUT, isAuth, postLogout);
router.get(ADMIN_REGISTER, isAuth, RegisterPage);
router.post(ADMIN_REGISTER, isAuth, RegisterUser);
router.get(ADMIN_CHANGE_PASSWORD, isAuth, ChangeUserPassword);
router.post(ADMIN_CHANGE_PASSWORD, isAuth, postChangeUserPassword);

module.exports = router;
