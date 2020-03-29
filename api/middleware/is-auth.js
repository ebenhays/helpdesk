const { ADMIN_LOGIN } = require("../../commons/constants");
module.exports = (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect(ADMIN_LOGIN);
  }
  next();
};
