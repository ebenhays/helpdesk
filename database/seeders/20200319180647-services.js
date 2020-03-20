"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Services",
      [
        {
          servicename: "Account Enquires",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          servicename: "Mobile Banking Enquires",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          servicename: "Cheque Enquires",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          servicename: "Other Services",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Services", null, {});
  }
};
