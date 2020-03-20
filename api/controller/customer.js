const { customerPage, postCustomerPage } = require("../repository/customer");

exports.customerPage = async (req, res) => {
  await customerPage(req, res);
};
exports.PostcustomerPage = async (req, res) => {
  await postCustomerPage(req, res);
};
