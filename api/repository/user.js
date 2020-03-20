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
  VIEW_CHANGE_PWD,
  ADMIN_CHANGE_PASSWORD,
  LOGIN_PAGETITLE,
  REGISTER_PAGETITLE,
  CHANGE_PWD_PAGETITLE,
  HELPDESK,
  ADMIN_LOGIN
} = require("../../commons/constants");
const moment = require("moment");
const CODE_LENGTH = 8;
exports.loginPage = (req, res) => {
  res.render(VIEW_LOGIN, {
    pageTitle: LOGIN_PAGETITLE,
    isError: null,
    successMsg: null,
    errMsg: null
  });
};

exports.postLogin = async (req, res) => {
  const { email, userpassword } = req.body;
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
        //cookie
        //res.setHeader('Set-Cookie', 'loggedIn=true'; HttpOnly);
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
        res.render(VIEW_LOGIN, {
          isError: true,
          successMsg: null,
          errMsg: "Credentials Invalid",
          pageTitle: LOGIN_PAGETITLE
        });
      }
    });
  } else {
    res.render(VIEW_LOGIN, {
      isError: true,
      successMsg: null,
      errMsg: "Credentials Invalid",
      pageTitle: LOGIN_PAGETITLE
    });
  }
};

exports.registerPage = (req, res) => {
  res.render(VIEW_REGISTER, {
    pageTitle: REGISTER_PAGETITLE,
    isError: null,
    successMsg: null,
    errMsg: null
  });
};

exports.postRegister = async (req, res) => {
  const { fullname, email, role } = req.body;
  const generatedPassword = passwordGenerate();
  console.log(generatedPassword);
  try {
    const checkUserExist = await models.UserProfiles.findOne({
      where: { username: email }
    });

    if (checkUserExist === null) {
      bcrypt.hash(generatedPassword, 12, (err, hash) => {
        if (err) {
          res.render(VIEW_REGISTER, {
            isError: true,
            errMsg: "There was a problem saving user",
            pageTitle: REGISTER_PAGETITLE
          });
        }
        models.UserProfiles.create({
          username: email,
          password: hash,
          role,
          fullname,
          IsDefault: "Y"
        });

        res.render(VIEW_REGISTER, {
          isError: false,
          successMsg: `User with email ${email} successfully created`,
          pageTitle: REGISTER_PAGETITLE
        });
      });

      // await sendUserEmail({
      //   toMail: email,
      //   subject: "Account Default Password",
      //   message: `Dear ${fullname}, Kindly use this password ${generatedPassword} to reset your account.`
      // });
    } else {
      res.render(VIEW_REGISTER, {
        isError: true,
        errMsg: `User with email ${email} already exist`,
        pageTitle: REGISTER_PAGETITLE
      });
    }
  } catch (error) {
    res.render(VIEW_REGISTER, {
      isError: true,
      errMsg: "There was a problem saving user",
      pageTitle: REGISTER_PAGETITLE
    });
  }
};

exports.changePassword = (req, res) => {
  res.render(VIEW_CHANGE_PWD, {
    pageTitle: CHANGE_PWD_PAGETITLE,
    isError: null,
    successMsg: null,
    errMsg: null
  });
};

exports.postChangePassword = async (req, res) => {
  console.log("got here men");
  try {
    const { confirmpassword, newpassword } = req.body;
    if (confirmpassword !== newpassword) {
      res.render(VIEW_CHANGE_PWD, {
        isError: true,
        successMsg: null,
        errMsg: "Password Mismatch",
        pageTitle: CHANGE_PWD_PAGETITLE
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
          res.render(VIEW_CHANGE_PWD, {
            isError: true,
            successMsg: null,
            errMsg: "Could not verify password. try again later",
            pageTitle: CHANGE_PWD_PAGETITLE
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
              res.redirect(HELPDESK.MAIN);
            } else {
              let respMessage = `Your password does not meet requirment,
                            It must contain at least 1 lowercase alphabetical character,
                            at least 1 uppercase alphabetical character,
                            at least 1 numeric character and at least one special character.
                            The total password length must be 8 characters or longer.
                          `;
              const newMsg = respMessage.replace(/\s+/g, " ");
              res.render(VIEW_CHANGE_PWD, {
                isError: true,
                successMsg: null,
                errMsg: newMsg,
                pageTitle: CHANGE_PWD_PAGETITLE
              });
            }
          });
        } else {
          res.render(VIEW_CHANGE_PWD, {
            isError: true,
            successMsg: null,
            errMsg:
              "This password has been used recently, please consider changing it.",
            pageTitle: CHANGE_PWD_PAGETITLE
          });
        }
      });
    } else {
      res.render(VIEW_CHANGE_PWD, {
        isError: true,
        successMsg: null,
        errMsg: "There was a problem verifying user",
        pageTitle: CHANGE_PWD_PAGETITLE
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const passwordGenerate = () => {
  let pwd = generatePassword(CODE_LENGTH, false);
  return pwd;
};
