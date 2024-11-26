const express = require('express');
const {
  createUser,
} = require('./users.controller');

const router = express.Router();

// route to create a new user
router.post('/', createUser);

module.exports = router;
