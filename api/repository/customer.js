const models = require("../../database/models");
const { VIEW_INDEX } = require("../../commons/constants");
const Chance = require("chance");
const chance = new Chance();
const uniques = chance.unique(chance.integer, 1, { min: 1, max: 9999999 });

exports.customerPage = async (req, res) => {
  res.render("index", {
    pageTitle: "Customer Complaints",
    isError: null,
    successMsg: null,
    errMsg: null,
    serviceData: await result()
  });
};

exports.postCustomerPage = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    await models.CustomerComplaint.create({
      customername: name,
      email,
      phoneno: phone,
      serviceId: service,
      message,
      status: "pending",
      ticketno: uniques[0]
    });
    //TODO: Send text message with ticket number
    res.render(VIEW_INDEX, {
      isError: false,
      successMsg: "We will respond shortly. Thank you",
      errMsg: null,
      pageTitle: "Customer Complaints",
      serviceData: await result()
    });
  } catch (error) {
    res.render(VIEW_INDEX, {
      isError: true,
      successMsg: null,
      errMsg: error.message,
      pageTitle: "Customer Complaints",
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
