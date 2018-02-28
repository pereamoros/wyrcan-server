const express = require('express')
const router = express.Router()

const Job = require('../models/jobs')

router.get('/my-jobs', (req, res, next) => {
  Job.find({})
    .then((jobs) => {
      res.json(jobs)
    })
    .catch(next)
})

router.post('/create', (req, res, next) => {
  const position = req.body.position
  const description = req.body.description

  const newJob = new Job({
    position,
    description,
    owner: req.session.currentUser._id
  })

  return newJob.save()
    .then(() => {
      res.json(newJob)
    })
    .catch(next)
})

module.exports = router
