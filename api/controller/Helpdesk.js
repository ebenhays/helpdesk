const {
  mainPage,
  getServices,
  postServices,
  getCustomerComplaints,
  AssignIssue,
  getProfileToAssign,
  postProfileToAssign,
  getAssignedComplaints,
  postUpdateAssignedIssue
} = require("../repository/helpdesk");

exports.mainPage = async (req, res) => {
  await mainPage(req, res);
};
exports.getServices = async (req, res) => {
  await getServices(req, res);
};

exports.postServices = async (req, res) => {
  await postServices(req, res);
};
exports.getCustomerComplaints = async (req, res) => {
  await getCustomerComplaints(req, res);
};

exports.getAssignedIssue = async (req, res) => {
  await AssignIssue(req, res);
};
exports.getProfileToAssign = async (req, res) => {
  await getProfileToAssign(req, res);
};
exports.postProfileToAssign = async (req, res) => {
  await postProfileToAssign(req, res);
};

exports.getAssignedIssues = async (req, res) => {
  await getAssignedComplaints(req, res);
};

exports.postUpdateAssignedIssue = async (req, res) => {
  await postUpdateAssignedIssue(req, res);
};
