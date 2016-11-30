'use strict';
module.exports = function(sequelize, DataTypes) {
  var Note = sequelize.define('Note', {
    subject: DataTypes.STRING,
    version: DataTypes.INTEGER,
    created: DataTypes.DATE,
    updated: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Note.belongsTo(models.User);
        Note.hasMany(models.NoteVersion);
      }
    }
  });
  return Note;
};
