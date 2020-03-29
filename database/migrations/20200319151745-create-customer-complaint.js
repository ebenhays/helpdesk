"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("CustomerComplaints", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customername: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phoneno: {
        type: Sequelize.STRING
      },
      serviceId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      ticketno: {
        type: Sequelize.STRING,
        unique: true
      },
      assignedTo: { type: Sequelize.STRING },
      assignedBy: { type: Sequelize.STRING },
      assignedDate: { type: Sequelize.DATE },
      resolvedDate: { type: Sequelize.DATE },
      resolvedBy: { type: Sequelize.STRING },
      closedDate: { type: Sequelize.DATE },
      closedBy: { type: Sequelize.STRING },
      reassignedBy: { type: Sequelize.STRING },
      reassignedDate: { type: Sequelize.DATE },
      reassignedTo: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("CustomerComplaints");
  }
};
