'use strict';
module.exports = function(sequelize, DataTypes) {
  var NoteVersion = sequelize.define('NoteVersion', {
    body: DataTypes.TEXT,
    version: DataTypes.INTEGER,
    created: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        NoteVersion.belongsTo(models.Note);
      }
    }
  });
  return NoteVersion;
};
