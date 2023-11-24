const express = require('express');
//const { CustomError, ErrorTypes } = require('../lib/CustomError');
const router = express.Router();

router.get('/', async (req, res, next) => {
  await res.render('index');
});

router.get('/login', async (req, res, next) => {
  console.log('login');
  res.render('login');
});

router.get('/logout', async (req, res, next) => {
  console.log('logout');
  res.render('logout');
});

router.get('/signup', async (req, res, next) => {
  console.log('signup');
  res.render('signup');
});

router.get('/user-info', async (req, res, next) => {
  console.log('user-info');
  res.render('user-info');
});

module.exports = router;
