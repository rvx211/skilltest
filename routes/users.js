var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET user list */
router.get('/', function(req, res) {
  models.User.findAll({
    // you can include choices for the poll, or not.
    //include: [{ model: db.Choice, as: 'choices' }]
  }).then(function(users) {
    res.send({
      users: users
    });
  });
});

/* CREATE user */
router.post('/', function(req, res) {
  models.User.create({
    username: req.body.username,
    password: req.body.password,
    type: req.body.type,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    mobile: req.body.mobile,
    email: req.body.email
  }).then(function(user) {
    res.json(user);
  }).catch(function(error) {
    res.json('user failed to create, reason: ' + error);
  });
});

/* GET single user */
router.get('/:id', function(req, res) {
  models.User.find({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    res.json(user);
  });
});

/* LOGIN a user */
router.post('/login', function(req, res) {
  models.User.findOne({
      where: {
          username: req.body.username
      }
  }).then(function(user) {
      res.json(user);
  }).catch(function(error) {
      res.json({"error": error});
  });
});

/* UPDATE a user */
router.put('/:id', function(req, res) {
  models.User.find({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    if(user){
      user.updateAttributes({
        password: req.body.password,
        type: req.body.type,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        mobile: req.body.mobile,
        email: req.body.email
      }).then(function(user) {
        res.json(user);
      }).catch(function(error) {
        res.json('user failed to update, reason: ' + error);
      });
    }
  });
});

/* DELETE a user */
router.delete('/:id', function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    res.json(user);
  }).catch(function(error) {
    res.json('user failed to delete, reason: ' + error );
  });
});

module.exports = router;
