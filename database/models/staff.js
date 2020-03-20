"use strict";
const { Department } = require("../models/department");
module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    "Staff",
    {
      name: DataTypes.STRING,
      deptId: {
        type: DataTypes.INTEGER,
        references: {
          model: Department,
          key: "id"
        }
      }
    },
    {}
  );
  Staff.associate = function(models) {
    // associations can be defined here
    Staff.belongsTo(models.Department, { foreignKey: "deptId" });
  };
  return Staff;
};
