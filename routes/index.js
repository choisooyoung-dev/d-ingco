const express = require('express');
const router = express.Router();

const loginRouter = require('./users/login.routes.js'); // [이아영] 로그인 라우터 조회
const signupRouter = require('./users/signup.routes.js');
const editRouter = require('./posts/post.routes.js'); // [
// const postsRouter = require('./posts/'); // [이아영] posts 라우터 조회

router.use("/users/login", loginRouter);
router.use("/users/signup", signupRouter);
router.use("/posts", editRouter);

module.exports = router;
