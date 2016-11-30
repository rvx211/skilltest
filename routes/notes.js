var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');

/* GET Notes list */
router.get('/:userid',function(req, res) {
  models.Note.findAll({
    // you can include choices for the poll, or not.
    //include: [{ model: db.Choice, as: 'choices' }]
    where: {
      UserId: req.params.userid
    }
  }).then(function(notes) {
    res.send({
      notes: notes
    });
  }).catch(function(error) {
    res.json('notes failed to retrieve, reason: ' + error);
  });;
});

/* CREATE Note */
router.post('/',function(req, res) {
  models.Note.create({
    subject: req.body.subject,
    version: parseInt("1"),
    created: Sequelize.fn('NOW'),
    updated: Sequelize.fn('NOW'),
    UserId: req.body.user
  }).then(function(note) {
    models.NoteVersion.create({
      body: req.body.body,
      version: parseInt("1"),
      created: Sequelize.fn('NOW'),
      NoteId: note.id
    }).then(function() {
      res.json(note);
    }).catch(function(error) {
      res.json('note failed to create, reason: ' + error);
    });
  }).catch(function(error) {
    res.json('note failed to create, reason: ' + error);
  });
});

/* GET single note */
router.get('/:userid/:id',function(req, res) {
  models.Note.find({
    where: {
      id: req.params.id,
      UserId: req.params.userid
    }, 
    include: [{
      model: models.NoteVersion
    }]
  }).then(function(note) {
    res.json({
      "id": note.id,
      "subject": note.subject,
      "version": note.version,
      "created": note.created,
      "updated": note.updated,
      "createdAt": note.createdAt,
      "updatedAt": note.updatedAt,
      "UserId": note.UserId,
      "NoteVersions": note.NoteVersions[note.NoteVersions.length-1]
    });
  }).catch(function(error) {
    res.json('note failed to retrieve, reason: ' + error);
  });
});

/* UPDATE a note */
router.put('/:id',function(req, res) {
  models.Note.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(note) {
    if(note){
      var version = note.version + 1;
      note.updateAttributes({
        version: version
      }).then(function(note) {
        models.NoteVersion.create({
          body: req.body.body,
          version: note.version,
          created: Sequelize.fn('NOW'),
          NoteId: note.id
        }).then(function(noteversion) {
          res.json({
            'note': note,
            'noteversion': noteversion
          });
        }).catch(function(error) {
          res.json('note failed to create, reason: ' + error);
        });
      }).catch(function(error) {
        res.json('note failed to update, reason: ' + error);
      });
    }
  }).catch(function(error) {
    res.json('note failed to update, reason: ' + error);
  });
});

/* DELETE a note */
router.delete('/:id',function(req, res) {
  models.NoteVersion.destroy({
    where: {
      NoteId: req.params.id
    }
  }).then(function() {
    models.Note.destroy({
      where: {
        id: req.params.id
      }
    }).then(function() {
      res.json('note ' + req.params.id + ' successfully deleted.');
    }).catch(function(error) {
      res.json('note failed to delete, reason: ' + error );
    });
  }).catch(function(error) {
    res.json('note failed to delete, reason: ' + error );
  });
});

module.exports = router;
