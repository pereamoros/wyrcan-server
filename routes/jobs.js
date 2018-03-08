const express = require('express');
const router = express.Router();

const Job = require('../models/jobs');
const User = require('../models/user');

router.get('/jobs', (req, res, next) => {
  Job.find({archive: false})
    .then((jobs) => {
      res.json(jobs);
    })
    .catch(next);
});

router.get('/my-jobs', (req, res, next) => {
  Job.find({$and: [{owner: req.session.currentUser._id}, {archive: false}]})
    .then((jobs) => {
      res.json(jobs);
    })
    .catch(next);
});

router.get('/archived', (req, res, next) => {
  Job.find({$and: [{owner: req.session.currentUser._id}, {archive: true}]})
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.get('/applied', (req, res, next) => {
  const currentUser = req.session.currentUser._id;
  User.findById(currentUser)
    .populate('appliedJobs.job')
    .then((user) => {
      res.json(user);
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
    owner: req.session.currentUser._id,
    archive: false
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
  const updateApply = {
    $push: {
      appliedJobs: {
        job: jobId
      }
    }
  };

  return User.update({_id: applicant, 'appliedJobs.job': {$ne: jobId}}, updateApply)
    .then((user) => {
      Job.update({_id: jobId, 'applications.user': {$ne: applicant}}, updates)
        .then(() => {
          res.json(Job);
        })
        .catch(next);
    })
    .catch(next);
});

router.post('/:id/archive', (req, res, next) => {
  const jobId = req.params.id;
  const updates = {
    $set: {
      archive: true
    }
  };
  return Job.update({_id: jobId}, updates)
    .then(() => {
      res.json(Job);
    })
    .catch(next);
});

router.post('/:id/unarchive', (req, res, next) => {
  const jobId = req.params.id;
  const updates = {
    $set: {
      archive: false
    }
  };
  return Job.update({_id: jobId}, updates)
    .then(() => {
      res.json(Job);
    })
    .catch(next);
});

router.post('/:id/delete', (req, res, next) => {
  const jobId = req.params.id;
  return Job.deleteOne({_id: jobId})
    .then(() => {
      res.json(Job);
    })
    .catch(next);
});

router.post('/:id/candidate/:userId/accept', (req, res, next) => {
  const jobId = req.params.id;
  const userId = req.params.userId;
  const updateApply = {
    $set: {
      'appliedJobs.$.status': 'accepted'
    }
  };

  return User.update({_id: userId, 'appliedJobs.job': jobId}, updateApply)
    .then((response) => {
      console.log(response);
      res.json(User);
    })
    .catch(next);
});

router.post('/:id/candidate/:userId/reject', (req, res, next) => {
  const jobId = req.params.id;
  const userId = req.params.userId;
  const updateApply = {
    $set: {
      'appliedJobs.$.status': 'rejected'
    }
  };

  return User.update({_id: userId, 'appliedJobs.job': jobId}, updateApply)
    .then((response) => {
      console.log(response);
      res.json(User);
    })
    .catch(next);
});

module.exports = router;
