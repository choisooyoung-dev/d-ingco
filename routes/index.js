const express = require('express');
const router = express.Router();

const loginRouter = require('./users/login.routes.js'); // [이아영] 로그인 라우터 조회
// const postsRouter = require('./posts/'); // [이아영] posts 라우터 조회
const signupRouter = require('./users/signup.routes.js');

router.use('/users/login', loginRouter);
router.use('/users/signup', signupRouter);
console.log(signupRouter);

module.exports = router;
