const express = require('express');
const router = express.Router();

const loginRouter = require('./users/login.routes.js'); // [이아영] 로그인 라우터 조회
const editRouter = require('./posts/post.routes.js'); // [
// const postsRouter = require('./posts/'); // [이아영] posts 라우터 조회

router.use("/users/login", loginRouter);
router.use("/posts", editRouter);

module.exports = router;
