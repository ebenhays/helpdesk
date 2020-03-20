'use strict';
module.exports = (sequelize, DataTypes) => {
  const Services = sequelize.define('Services', {
    servicename: DataTypes.STRING
  }, {});
  Services.associate = function(models) {
    // associations can be defined here
  };
  return Services;
};