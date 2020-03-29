const bcrypt = require("bcryptjs");
const models = require("../../database/models");
const generatePassword = require("password-generator");
const { sendUserEmail } = require("../../commons/sendMail");
const strongPasswordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

const {
  VIEW_LOGIN,
  VIEW_REGISTER,
  ADMIN_REGISTER,
  VIEW_CHANGE_PWD,
  ADMIN_CHANGE_PASSWORD,
  LOGIN_PAGETITLE,
  REGISTER_PAGETITLE,
  CHANGE_PWD_PAGETITLE,
  HELPDESK,
  ADMIN_LOGIN
} = require("../../commons/constants");

const CODE_LENGTH = 8;
const { validationResult } = require("express-validator");
exports.loginPage = (req, res) => {
  try {
    return res.render(VIEW_LOGIN, {
      pageTitle: LOGIN_PAGETITLE,
      isError: req.flash("iserror").length > 0 ? true : null,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: req.flash("error"),
      oldInput: {
        email: "",
        password: ""
      }
    });
  } catch (error) {}
};

exports.postLogin = async (req, res) => {
  const { email, userpassword } = req.body;
  const errors = validationResult(req);
  const errpush = [];
  if (errors.array().length > 0) {
    errors.array().map(v => {
      errpush.push(v.msg);
    });
  }
  if (!errors.isEmpty()) {
    return res.render(VIEW_LOGIN, {
      pageTitle: LOGIN_PAGETITLE,
      isError: true,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: errpush,
      oldInput: {
        email: email,
        password: userpassword
      }
    });
  }
  const checkUser = await models.UserProfiles.findOne({
    where: { username: email }
  });
  if (checkUser !== null) {
    const {
      role,
      password,
      IsDefault,
      fullname,
      pwdExpiresAt
    } = checkUser.dataValues;
    bcrypt.compare(userpassword, password, (err, result) => {
      if (result) {
        req.session.loggedIn = true;
        req.session.user = email;
        req.session.name = fullname;

        if (IsDefault === "Y") {
          res.redirect(`${ADMIN_LOGIN}${ADMIN_CHANGE_PASSWORD}`);
        } else if (
          pwdExpiresAt !== null &&
          new Date() >= new Date(pwdExpiresAt)
        ) {
          res.redirect(`${ADMIN_LOGIN}${ADMIN_CHANGE_PASSWORD}`);
        } else {
          res.redirect(HELPDESK.MAIN);
        }
      } else {
        req.flash("error", "Credentials Invalid");
        req.flash("iserror", true);
        return res.render(VIEW_LOGIN, {
          pageTitle: LOGIN_PAGETITLE,
          isError: req.flash("iserror").length > 0 ? true : null,
          isSuccess: req.flash("issuccess").length > 0 ? true : null,
          successMsg: req.flash("success"),
          errMsg: req.flash("error"),
          oldInput: {
            email: email,
            password: userpassword
          }
        });
      }
    });
  } else {
    req.flash("error", "Credentials Invalid");
    req.flash("iserror", true);
    return res.render(VIEW_LOGIN, {
      pageTitle: LOGIN_PAGETITLE,
      isError: req.flash("iserror").length > 0 ? true : null,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: req.flash("error"),
      oldInput: {
        email: email,
        password: userpassword
      }
    });
  }
};

exports.postLogout = async (req, res) => {
  req.session.destroy(err => {
    res.redirect(ADMIN_LOGIN);
  });
};

exports.registerPage = (req, res) => {
  return res.render(VIEW_REGISTER, {
    pageTitle: REGISTER_PAGETITLE,
    isError: req.flash("iserror").length > 0 ? true : null,
    isSuccess: req.flash("issuccess").length > 0 ? true : null,
    successMsg: req.flash("success"),
    errMsg: req.flash("error"),
    oldInput: {
      fullname: "",
      email: "",
      role: ""
    }
  });
};

exports.postRegister = async (req, res) => {
  const { fullname, email, role } = req.body;
  const generatedPassword = passwordGenerate();
  try {
    const checkUserExist = await models.UserProfiles.findOne({
      where: { username: email }
    });

    if (checkUserExist === null) {
      bcrypt.hash(generatedPassword, 12, (err, hash) => {
        if (err) {
          req.flash("error", "There was a problem saving user");
          req.flash("iserror", true);
          return res.render(VIEW_REGISTER, {
            pageTitle: REGISTER_PAGETITLE,
            isError: req.flash("iserror").length > 0 ? true : null,
            isSuccess: req.flash("issuccess").length > 0 ? true : null,
            successMsg: req.flash("success"),
            errMsg: req.flash("error"),
            oldInput: {
              fullname: fullname,
              email: email,
              role: role
            }
          });
        }
        models.UserProfiles.create({
          username: email,
          password: hash,
          role,
          fullname,
          IsDefault: "Y"
        });
        req.flash("success", "User Registered Successfully");
        req.flash("issuccess", true);
        return res.render(VIEW_REGISTER, {
          pageTitle: REGISTER_PAGETITLE,
          isError: req.flash("iserror").length > 0 ? true : null,
          isSuccess: req.flash("issuccess").length > 0 ? true : null,
          successMsg: req.flash("success"),
          errMsg: req.flash("error"),
          oldInput: {
            fullname: fullname,
            email: email,
            role: role
          }
        });
      });
      await sendUserEmail(
        email,
        "Account Default Password",
        `<p> Dear ${fullname}, <br/>
         <p> Kindly use this password <b>${generatedPassword}</b> to reset your account.</p> <br/>
         <p> You can login to <a href="${process.env.BASE_URL}/admin">Helpdesk</a> to reset your password. </p>
         `
      );
    } else {
      req.flash("error", `User with email ${email} already exist`);
      req.flash("iserror", true);
      return res.render(VIEW_REGISTER, {
        pageTitle: REGISTER_PAGETITLE,
        isError: req.flash("iserror").length > 0 ? true : null,
        isSuccess: req.flash("issuccess").length > 0 ? true : null,
        successMsg: req.flash("success"),
        errMsg: req.flash("error"),
        oldInput: {
          fullname: fullname,
          email: email,
          role: role
        }
      });
    }
  } catch (error) {
    req.flash("error", `User with email ${email} already exist`);
    req.flash("iserror", true);
    return res.render(VIEW_REGISTER, {
      pageTitle: REGISTER_PAGETITLE,
      isError: req.flash("iserror").length > 0 ? true : null,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: req.flash("error"),
      oldInput: {
        fullname: fullname,
        email: email,
        role: role
      }
    });
  }
};

exports.changePassword = (req, res) => {
  return res.render(VIEW_CHANGE_PWD, {
    pageTitle: CHANGE_PWD_PAGETITLE,
    isError: req.flash("iserror").length > 0 ? true : null,
    isSuccess: req.flash("issuccess").length > 0 ? true : null,
    successMsg: req.flash("success"),
    errMsg: req.flash("error"),
    oldInput: {
      confirmpassword: "",
      newpassword: ""
    }
  });
};

exports.postChangePassword = async (req, res) => {
  try {
    const { confirmpassword, newpassword } = req.body;
    if (confirmpassword !== newpassword) {
      req.flash("error", "Password Mismatch");
      req.flash("iserror", true);
      return res.render(VIEW_CHANGE_PWD, {
        pageTitle: CHANGE_PWD_PAGETITLE,
        isError: req.flash("iserror").length > 0 ? true : null,
        isSuccess: req.flash("issuccess").length > 0 ? true : null,
        successMsg: req.flash("success"),
        errMsg: req.flash("error"),
        oldInput: {
          confirmpassword: confirmpassword,
          newpassword: newpassword
        }
      });
    }
    Date.prototype.addDays = function(days) {
      let date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    const checkUser = await models.UserProfiles.findOne({
      where: { username: req.session.user }
    });

    if (checkUser !== null) {
      const {
        role,
        password,
        IsDefault,
        fullname,
        pwdExpiresAt,
        username
      } = checkUser.dataValues;

      bcrypt.compare(confirmpassword, password, (err, result) => {
        if (err) {
          req.flash("error", "Could not verify password. try again later");
          req.flash("iserror", true);
          return res.render(VIEW_CHANGE_PWD, {
            pageTitle: CHANGE_PWD_PAGETITLE,
            isError: req.flash("iserror").length > 0 ? true : null,
            isSuccess: req.flash("issuccess").length > 0 ? true : null,
            successMsg: req.flash("success"),
            errMsg: req.flash("error"),
            oldInput: {
              confirmpassword: confirmpassword,
              newpassword: newpassword
            }
          });
        }
        if (!result) {
          bcrypt.hash(confirmpassword, 12, (err, newHash) => {
            if (strongPasswordRegex.test(confirmpassword)) {
              let nextPwdChangeDate = new Date();
              models.UserProfiles.update(
                {
                  password: newHash,
                  IsDefault: "N",
                  pwdExpiresAt: nextPwdChangeDate.addDays(45)
                },
                { where: { username } }
              );
              return res.redirect(HELPDESK.MAIN);
            } else {
              let respMessage = `Your password does not meet requirment,
                            It must contain at least 1 lowercase alphabetical character,
                            at least 1 uppercase alphabetical character,
                            at least 1 numeric character and at least one special character.
                            The total password length must be 8 characters or longer.
                          `;
              const newMsg = respMessage.replace(/\s+/g, " ");
              req.flash("error", newMsg);
              req.flash("iserror", true);
              return res.render(VIEW_CHANGE_PWD, {
                pageTitle: CHANGE_PWD_PAGETITLE,
                isError: req.flash("iserror").length > 0 ? true : null,
                isSuccess: req.flash("issuccess").length > 0 ? true : null,
                successMsg: req.flash("success"),
                errMsg: req.flash("error"),
                oldInput: {
                  confirmpassword: confirmpassword,
                  newpassword: newpassword
                }
              });
            }
          });
        } else {
          req.flash(
            "error",
            "This password has been used recently, please consider changing it."
          );
          req.flash("iserror", true);
          return res.render(VIEW_CHANGE_PWD, {
            pageTitle: CHANGE_PWD_PAGETITLE,
            isError: req.flash("iserror").length > 0 ? true : null,
            isSuccess: req.flash("issuccess").length > 0 ? true : null,
            successMsg: req.flash("success"),
            errMsg: req.flash("error"),
            oldInput: {
              confirmpassword: confirmpassword,
              newpassword: newpassword
            }
          });
        }
      });
    } else {
      req.flash("error", "There was a problem verifying user");
      req.flash("iserror", true);
      return res.render(VIEW_CHANGE_PWD, {
        pageTitle: CHANGE_PWD_PAGETITLE,
        isError: req.flash("iserror").length > 0 ? true : null,
        isSuccess: req.flash("issuccess").length > 0 ? true : null,
        successMsg: req.flash("success"),
        errMsg: req.flash("error"),
        oldInput: {
          confirmpassword: confirmpassword,
          newpassword: newpassword
        }
      });
    }
  } catch (error) {
    req.flash("error", "A problem occured changing password");
    req.flash("iserror", true);
    return res.render(VIEW_CHANGE_PWD, {
      pageTitle: CHANGE_PWD_PAGETITLE,
      isError: req.flash("iserror").length > 0 ? true : null,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: req.flash("error"),
      oldInput: {
        confirmpassword: confirmpassword,
        newpassword: newpassword
      }
    });
  }
};

const passwordGenerate = () => {
  let pwd = generatePassword(CODE_LENGTH, false);
  return pwd;
};
