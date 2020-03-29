const models = require("../../database/models");
const { VIEW_INDEX } = require("../../commons/constants");
const Chance = require("chance");
const chance = new Chance();
const uniques = chance.unique(chance.integer, 1, { min: 1, max: 9999999 });
const { validationResult } = require("express-validator");
exports.customerPage = async (req, res) => {
  return res.render("index", {
    pageTitle: "Customer Complaints",
    isError: req.flash("iserror").length > 0 ? true : null,
    isSuccess: req.flash("issuccess").length > 0 ? true : null,
    successMsg: req.flash("success"),
    errMsg: req.flash("error"),
    oldInput: {
      email: "",
      name: "",
      service: "",
      message: "",
      phone: ""
    },
    serviceData: await result()
  });
};

exports.postCustomerPage = async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  try {
    const errors = validationResult(req);
    const errpush = [];
    if (errors.array().length > 0) {
      errors.array().map(v => {
        errpush.push(v);
      });
    }
    if (errpush.length > 0) {
      req.flash("iserror", true);
      req.flash("error", errpush);
      return res.status(500).render("index", {
        pageTitle: "Customer Complaints",
        isError: req.flash("iserror").length > 0 ? true : null,
        isSuccess: req.flash("issuccess").length > 0 ? true : null,
        successMsg: req.flash("success"),
        errMsg: req.flash("error"),
        oldInput: {
          email: email,
          name: name,
          service: service,
          message: message,
          phone: phone
        },
        serviceData: await result()
      });
    }

    await models.CustomerComplaint.create({
      customername: name,
      email: email,
      phoneno: phone,
      serviceId: service,
      message,
      status: "pending",
      ticketno: uniques[0]
    });
    //TODO: Send text message with ticket number
    req.flash("success", "We will respond shortly. Thank you");
    req.flash("issuccess", true);
    return res.render(VIEW_INDEX, {
      isError: req.flash("iserror").length > 0 ? true : null,
      successMsg: req.flash("success"),
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      errMsg: req.flash("error"),
      pageTitle: "Customer Complaints",
      oldInput: {
        email: "",
        name: "",
        service: "",
        message: "",
        phone: ""
      },
      serviceData: await result()
    });
  } catch (error) {
    req.flash("iserror", true);
    req.flash("error", "There was a problem sending the request");
    return res.status(500).render("index", {
      pageTitle: "Customer Complaints",
      isError: req.flash("iserror").length > 0 ? true : null,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: req.flash("error"),
      oldInput: {
        email: email,
        name: name,
        service: service,
        message: message,
        phone: phone
      },
      serviceData: await result()
    });
  }
};

const result = async () => {
  const data = await models.Services.findAll({
    attributes: ["id", "servicename"]
  });
  return data;
};
