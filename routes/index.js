const express = require('express');
const router = express.Router();

const loginRouter = require('./users/login.routes.js'); // [이아영] 로그인 라우터 조회
// const postsRouter = require('./posts/'); // [이아영] posts 라우터 조회

router.use("/users/login", loginRouter);

router.get('/', (req, res) => {
  // http://localhost:3000/views/
  res.send('3000 접속했습니다~');
});

module.exports = router;