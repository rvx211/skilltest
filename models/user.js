'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      set: function (val) {
         this.setDataValue('password', val); // Remember to set the data value, otherwise it won't be validated
         this.setDataValue('password_hash', this.salt + val);
       },
       validate: {
          isLongEnough: function (val) {
            var pass_contains =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
            if (!val.match(pass_contains)) {
              throw new Error("The password should contains uppercase, lowercase, special character and have 8 character at minimum")
            }
          }
       }
    },
    type: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.TEXT,
    mobile: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.hasMany(models.Note);
      }
    }
  });
  return User;
};
