const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/user');

router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(404).json({error: 'not-found'});
  }
});

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({error: 'unauthorized'});
  }

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(422).json({error: 'validation'});
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({error: 'not-found'});
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.json(user);
      } else {
        return res.status(404).json({error: 'not-found'});
      }
    })
    .catch(next);
});

router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({error: 'unauthorized'});
  }
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (!username || !password) {
    return res.status(422).json({error: 'validation'});
  }

  User.findOne({username}, 'username')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({error: 'username-not-unique'});
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        name,
        username,
        password: hashPass,
        role
      });

      return newUser.save()
        .then(() => {
          req.session.currentUser = newUser;
          res.json(newUser);
        });
    })
    .catch(next);
});

router.post('/logout', (req, res) => {
  req.session.currentUser = null;
  return res.status(204).send();
});

router.get('/profile/:id', (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json(new Error('404'));
      }
      return res.json(user);
    })
    .catch(next);
});

router.post('/edit/:id', (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((result) => {
      let newDescription = '';
      if (req.body.description === undefined) {
        newDescription = result.description;
      } else {
        newDescription = req.body.description;
      }
      const data = {
        description: newDescription
      };
      result.update(data)
        .then((user) => {
          return res.json(user);
        }).catch(next);
    });
});

module.exports = router;
