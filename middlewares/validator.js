const { body } = require('express-validator');

const userSignupValidate = [
  body('username').trim().isLength({ min: 1 }),
  body('name').trim().isLength({ min: 1 }),
  body('email').trim().isEmail(),
  body('password').trim().isLength({ min: 6 }),
  body('confirmPassword')
    .trim()
    .isLength({ min: 6 })
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
];

const userLoginValidate = [
  body('username').trim().isLength({ min: 1 }),
  body('password').trim().isLength({ min: 6 }),
];

const postValidate = [
  body('title').trim().isLength({ min: 1 }),
  body('content').trim().isLength({ min: 1 }),
];

const commentValidate = [
  body('comment_content').trim().isLength({ min: 1 }),
];

module.exports = { userSignupValidate, userLoginValidate, postValidate, commentValidate };
