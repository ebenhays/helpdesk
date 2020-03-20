const { mainPage } = require("../repository/helpdesk");

exports.mainPage = async (req, res) => {
  await mainPage(req, res);
};
