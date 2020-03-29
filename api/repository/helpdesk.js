const { HELPDESK } = require("../../commons/constants");
const models = require("../../database/models");
const { validationResult } = require("express-validator");
const moment = require("moment");
const { sendUserEmail } = require("../../commons/sendMail");
exports.mainPage = async (req, res) => {
  res.render(HELPDESK.VIEW_HELPDESK, {
    pageTitle: HELPDESK.PAGE_TITLE,
    isError: req.flash("iserror").length > 0 ? true : null,
    isSuccess: req.flash("issuccess").length > 0 ? true : null,
    successMsg: req.flash("success"),
    errMsg: req.flash("error"),
    username: req.session.name,
    assigned: !(await assignedIssueCount()) ? 0 : await assignedIssueCount(),
    pending: !(await pendingIssueCount()) ? 0 : await pendingIssueCount(),
    resolved: !(await resolvedIssueCount()) ? 0 : await resolvedIssueCount(),
    closed: !(await closedIssueCount()) ? 0 : await closedIssueCount()
  });
};

exports.getServices = async (req, res) => {
  return res.render(HELPDESK.VIEW_SERVICE, {
    pageTitle: HELPDESK.PAGE_TITLE,
    isError: req.flash("iserror").length > 0 ? true : null,
    isSuccess: req.flash("issuccess").length > 0 ? true : null,
    successMsg: req.flash("success"),
    errMsg: req.flash("error"),
    username: req.session.name,
    services: await getServicesRecord(),
    oldInput: {
      servicename: ""
    }
  });
};

exports.postServices = async (req, res) => {
  try {
    const { servicename } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("iserror", true);
      req.flash("error", errors.array()[0].msg);
      return res.render(HELPDESK.VIEW_SERVICE, {
        pageTitle: HELPDESK.PAGE_TITLE,
        isError: req.flash("iserror").length > 0 ? true : null,
        isSuccess: req.flash("issuccess").length > 0 ? true : null,
        successMsg: req.flash("success"),
        errMsg: req.flash("error"),
        username: req.session.name,
        services: await getServicesRecord(),
        oldInput: {
          servicename: servicename
        }
      });
    }
    await models.Services.create({ servicename });
    req.flash("issuccess", true);
    req.flash("success", "Services saved");
    return res.redirect(HELPDESK.ADD_SERVICE);
  } catch (error) {
    req.flash("iserror", true);
    req.flash("error", error.message);
    return res.render(HELPDESK.VIEW_SERVICE, {
      pageTitle: HELPDESK.PAGE_TITLE,
      isError: req.flash("iserror").length > 0 ? true : null,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: req.flash("error"),
      username: req.session.name,
      services: await getServicesRecord(),
      oldInput: {
        servicename: servicename
      }
    });
  }
};

const getServicesRecord = async () => {
  const service = await models.Services.findAll({
    attributes: ["servicename"]
  });
  return service;
};

exports.getAssignedComplaints = async (req, res) => {
  try {
    const results = await models.CustomerComplaint.findAll({
      where: { status: "assigned" },
      attributes: [
        "customername",
        "id",
        "email",
        "ticketno",
        "phoneno",
        "message",
        "status",
        "assignedTo",
        "assignedDate",
        "assignedBy",
        "createdAt"
      ],
      include: [{ model: models.Services, attributes: ["servicename"] }],
      order: [["createdAt", "DESC"]]
    });
    const data = results.map(record => {
      return {
        id: record.id,
        ticketno: record.ticketno,
        loggedBy: record.customername,
        email: record.email,
        phone: record.phoneno,
        message: record.message,
        assignedTo: record.assignedTo,
        assignedBy: record.assignedBy,
        assignedDate: moment(record.assignedDate).format("LL"),
        service: record.Service.servicename,
        status: record.status,
        logDate: moment(record.createdAt).format("LL")
      };
    });

    const resultsResolved = await models.CustomerComplaint.findAll({
      where: { status: "resolved" },
      attributes: [
        "customername",
        "id",
        "email",
        "ticketno",
        "phoneno",
        "message",
        "status",
        "assignedTo",
        "assignedDate",
        "resolvedDate",
        "resolvedBy",
        "assignedBy",
        "createdAt"
      ],
      include: [{ model: models.Services, attributes: ["servicename"] }],
      order: [["createdAt", "DESC"]]
    });
    const dataResolved = resultsResolved.map(record => {
      return {
        id: record.id,
        ticketno: record.ticketno,
        loggedBy: record.customername,
        email: record.email,
        phone: record.phoneno,
        message: record.message,
        assignedTo: record.assignedTo,
        assignedDate: moment(record.assignedDate).format("LL"),
        assignedBy: record.assignedBy,
        resolvedDate: moment(record.resolvedDate).format("LL"),
        resolvedBy: record.resolvedBy,
        service: record.Service.servicename,
        status: record.status,
        logDate: moment(record.createdAt).format("LL")
      };
    });

    const resultsClosed = await models.CustomerComplaint.findAll({
      where: { status: "closed" },
      attributes: [
        "customername",
        "id",
        "email",
        "ticketno",
        "phoneno",
        "message",
        "status",
        "assignedTo",
        "assignedDate",
        "assignedBy",
        "closedDate",
        "closedBy",
        "createdAt"
      ],
      include: [{ model: models.Services, attributes: ["servicename"] }],
      order: [["createdAt", "DESC"]]
    });
    const dataClosed = resultsClosed.map(record => {
      return {
        id: record.id,
        ticketno: record.ticketno,
        loggedBy: record.customername,
        email: record.email,
        phone: record.phoneno,
        message: record.message,
        assignedTo: record.assignedTo,
        assignedBy: record.assignedBy,
        assignedDate: moment(record.assignedDate).format("LL"),
        closedDate: moment(record.closedDate).format("LL"),
        closedBy: record.closedBy,
        service: record.Service.servicename,
        status: record.status,
        logDate: moment(record.createdAt).format("LL")
      };
    });

    res.render(HELPDESK.VIEW_CUSTOMER_ISSUES, {
      pageTitle: HELPDESK.PAGE_TITLE,
      isError: req.flash("iserror").length > 0 ? true : null,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: req.flash("error"),
      username: req.session.name,
      customerdata: data,
      resolvedcustomerdata: dataResolved,
      closedcustomerdata: dataClosed
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getCustomerComplaints = async (req, res) => {
  try {
    const results = await models.CustomerComplaint.findAll({
      where: { status: "pending" },
      include: [{ model: models.Services, attributes: ["servicename"] }],
      order: [["createdAt", "DESC"]]
    });
    const data = results.map(record => {
      return {
        id: record.id,
        ticketno: record.ticketno,
        loggedBy: record.customername,
        email: record.email,
        phone: record.phoneno,
        message: record.message,
        service: record.Service.servicename,
        status: record.status,
        logDate: moment(record.createdAt).format("LL")
      };
    });

    return res.render(HELPDESK.VIEW_CUSTOMER_TRANS, {
      pageTitle: HELPDESK.PAGE_TITLE,
      isError: req.flash("iserror").length > 0 ? true : null,
      isSuccess: req.flash("issuccess").length > 0 ? true : null,
      successMsg: req.flash("success"),
      errMsg: req.flash("error"),
      customerdata: data,
      username: req.session.name
    });
  } catch (error) {}
};

exports.AssignIssue = async (req, res) => {
  const id = req.params.id;
  const results = await models.CustomerComplaint.findAll({
    where: { id },
    attributes: ["ticketno", "message", "status", "id", "phoneno", "email"],
    include: [{ model: models.Services, attributes: ["servicename"] }],
    order: [["createdAt", "DESC"]]
  });
  const data = results.map(record => {
    return {
      id: record.id,
      ticketno: record.ticketno,
      email: record.email,
      phone: record.phoneno,
      message: record.message,
      service: record.Service.servicename,
      status: record.status
    };
  });
  return res.status(200).json({ data });
};

exports.getProfileToAssign = async (req, res) => {
  const data = await models.UserProfiles.findAll({
    order: [["fullname", "ASC"]],
    attributes: ["username", "fullname"]
  });
  return res.status(200).json({ data });
};

exports.postProfileToAssign = async (req, res) => {
  try {
    const {
      id,
      assignedTo,
      assignedDate,
      assVal,
      ticketno,
      message
    } = req.body;
    await models.CustomerComplaint.update(
      {
        assignedTo,
        assignedDate,
        assignedBy: req.session.name,
        status: "assigned"
      },
      { where: { id } }
    );

    res.status(200).json({ message: "Request Updated" });
    //send message to the assigned person
    sendUserEmail(
      email,
      "You have been assigned an issue",
      `<p> Dear ${assignedTo}, <br/>
         <p> An issue with ticket number <b>${ticketno}</b> has been assigned to you.</p> <br/>
         <p> <b>Subject</b> </p> <br/>
         <p> ${message} </p> <br/>
         <p> You can login to <a href="${process.env.BASE_URL}/admin">Helpdesk</a> to attend to the issue. </p>
         `
    )
      .then(() => res.status(200).json({ message: "Request Updated" }))
      .catch(error => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.postUpdateAssignedIssue = async (req, res) => {
  try {
    const { id, status, resolvedDate, closedDate, reassignedDate } = req.body;

    if (closedDate) {
      await models.CustomerComplaint.update(
        {
          closedBy: req.session.name,
          status,
          closedDate: moment()
        },
        { where: { id } }
      );
    }

    if (resolvedDate) {
      await models.CustomerComplaint.update(
        {
          resolvedBy: req.session.name,
          resolvedDate: moment(),
          status
        },
        { where: { id } }
      );
    }

    if (reassignedDate) {
      await models.CustomerComplaint.update(
        {
          reassignedBy: req.session.name,
          reassignedDate: moment(),
          status
        },
        { where: { id } }
      );
    }

    res.status(200).json({ message: "Request Updated" });
    //TODO send text message to customer.

    //send message to the assigned person
    sendUserEmail(
      email,
      "You have been assigned an issue",
      `<p> Dear ${assignedTo}, <br/>
         <p> An issue with ticket number <b>${ticketno}</b> has been assigned to you.</p> <br/>
         <p> <b>Subject</b> </p> <br/>
         <p> ${message} </p> <br/>
         <p> You can login to <a href="${process.env.BASE_URL}/admin">Helpdesk</a> to attend to the issue. </p>
         `
    )
      .then(() => res.status(200).json({ message: "Request Updated" }))
      .catch(error => {
        return res.status(500).json({ error: error.message });
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const assignedIssueCount = async () => {
  const assigned = await models.CustomerComplaint.count({
    where: { status: "assigned" }
  });
  return assigned;
};

const pendingIssueCount = async () => {
  const pending = await models.CustomerComplaint.count({
    where: { status: "pending" }
  });
  return pending;
};

const resolvedIssueCount = async () => {
  const resolved = await models.CustomerComplaint.count({
    where: { status: "resolved" }
  });
  return resolved;
};

const closedIssueCount = async () => {
  const closed = await models.CustomerComplaint.count({
    where: { status: "closed" }
  });
  return closed;
};
