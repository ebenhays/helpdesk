"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "UserProfiles",
    {
      username: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        }
      },
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      IsDefault: DataTypes.STRING,
      fullname: DataTypes.STRING,
      pwdExpiresAt: DataTypes.DATE
    },
    {}
  );
  UserProfile.associate = function(models) {
    // associations can be defined here
  };
  return UserProfile;
};
