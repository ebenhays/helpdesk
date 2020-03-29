const express = require("express");
const router = express.Router();
const {
  mainPage,
  getServices,
  postServices,
  getCustomerComplaints,
  getAssignedIssue,
  getProfileToAssign,
  postProfileToAssign,
  getAssignedIssues,
  postUpdateAssignedIssue
} = require("../controller/Helpdesk");
const { check } = require("express-validator");
const isAuth = require("../middleware/is-auth");
router.get("/", isAuth, mainPage);
router.post("/assign-issue", isAuth, postProfileToAssign);
router.post("/update-issue", isAuth, postUpdateAssignedIssue);
router.get("/add-services", isAuth, getServices);
router.get("/trans", isAuth, getAssignedIssues);
router.get("/request", isAuth, getCustomerComplaints);
router.get("/staff", isAuth, getProfileToAssign);
router.post(
  "/add-services",
  check("servicename", "Please enter service name").notEmpty(),
  isAuth,
  postServices
);

router.get("/:id", isAuth, getAssignedIssue);
module.exports = router;
