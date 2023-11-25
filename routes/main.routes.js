const express = require('express');
//const { CustomError, ErrorTypes } = require('../lib/CustomError');
const router = express.Router();

router.get('/logout', (req, res, next) => {
  console.log('logout');
  res.render('logout');
});

router.get('/user-info', (req, res, next) => {
  console.log('user-info');
  res.render('user-info');
});

module.exports = router;
