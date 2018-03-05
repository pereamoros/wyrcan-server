const express = require('express');
const router = express.Router();

const Job = require('../models/jobs');

router.get('/jobs', (req, res, next) => {
  Job.find()
    .then((jobs) => {
      res.json(jobs);
    })
    .catch(next);
});

router.get('/my-jobs', (req, res, next) => {
  Job.find({owner: req.session.currentUser._id})
    .then((jobs) => {
      res.json(jobs);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  const jobId = req.params.id;
  Job.findById(jobId)
    .populate('owner')
    .populate('applications.user')
    .then((job) => {
      if (!job) {
        return res.status(404).json(new Error('404'));
      }
      return res.json(job);
    })
    .catch(next);
});

router.post('/create', (req, res, next) => {
  const position = req.body.position;
  const description = req.body.description;
  const newJob = new Job({
    position,
    description,
    owner: req.session.currentUser._id
  });
  return newJob.save()
    .then(() => {
      res.json(newJob);
    })
    .catch(next);
});

router.post('/:id/apply', (req, res, next) => {
  const applicant = req.session.currentUser._id;
  const jobId = req.params.id;
  const updates = {
    $push: {
      applications: {
        user: applicant
      }
    }
  };

  return Job.update({_id: jobId, 'applications.user': {$ne: applicant}}, updates)
    .then(() => {
      res.json(Job);
    })
    .catch(next);
});

module.exports = router;
