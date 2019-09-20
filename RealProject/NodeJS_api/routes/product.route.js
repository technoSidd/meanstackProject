const express = require('express');
const app = express();
const router = express.Router();

// Require Product model in our routes module
let isuueTB = require('../model/Issue');

router.route('/issues').get((req, res) => {
  isuueTB.find((err, issues) => {
      if(!err) {
          res.json(issues);
      } else {
          console.log(err);
      }
  });
});

router.route('/issues/:id').get((req, res) => {
  isuueTB.findById(req.params.id, (err, issue) => {
      if(!err) {
          res.json(issue);
      } else {
          console.log(err);
      }
  });
});

router.route('/issues/add').post((req, res) => {
  const issue = new isuueTB(req.body);
  issue.save().then(issue => {
      res.status(200).json({'issue': 'Added successfully'});
  }).catch(err => {
      res.status(400).send('Failed to create new record');
  });
});

router.route('/issues/update/:id').post((req, res) => {
  isuueTB.findById(req.params.id, (err, issue) => {
      if(!issue) {
          return next(new Error('Could not load document'));
      } else {
          issue.title = req.body.title;
          issue.responsible = req.body.responsible;
          issue.description = req.body.description;
          issue.severity = req.body.severity;
          issue.status = req.body.status;

          issue.save().then(issue => {
              res.json('Update done');
          }).catch(err => {
              res.status(400).send('Update failed');
          });
      }
  });
});

router.route('/issues/delete/:id').get((req, res) => {
  isuueTB.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
      if(err) {
          res.json(err);
      } else {
          res.json('Remove successfully');
      }
  });
});

module.exports = router;