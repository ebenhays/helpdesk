const {
  loginPage,
  registerPage,
  postRegister,
  postLogin,
  changePassword,
  postChangePassword,
  postLogout
} = require("../repository/user");

exports.LoginPage = async (req, res) => {
  await loginPage(req, res);
};

exports.RegisterPage = async (req, res) => {
  await registerPage(req, res);
};

exports.RegisterUser = async (req, res) => {
  await postRegister(req, res);
};

exports.PostLoginUser = async (req, res) => {
  await postLogin(req, res);
};

exports.ChangeUserPassword = async (req, res) => {
  await changePassword(req, res);
};

exports.postChangeUserPassword = async (req, res) => {
  await postChangePassword(req, res);
};

exports.postLogout = async (req, res) => {
  await postLogout(req, res);
};
