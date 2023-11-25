const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const prisma = new PrismaClient();
const bcrypt = require('bcrypt'); // [이아영] 암호 해시화 패키지
const authMiddleware = require('../../middlewares/auth.middleware');
const {
  CustomError,
  ErrorTypes,
  ValidError,
} = require('../../lib/CustomError');
const { userLoginValidate } = require('../../middlewares/validator');
const { validationResult } = require('express-validator');

router.get('/login', async (req, res, next) => {
  try {
    res.render('index', {
      path: '/api/users/login',
      user: '',
    });
  } catch (error) {
    console.log(error);
  }
});

// LOGIN
router.post('/login', userLoginValidate, async (req, res, next) => {
  const errors = validationResult(req);
  try {
    // const username = document.getElementById('username').value;
    // const password = document.getElementById('password').value;
    // console.log(username, password);
    // console.log(req.params);
    const { username, password } = req.body; // body 값 조회

    // console.log(req.body);
    // 조회 : 회원 정보
    // id로 검색하고 pw 값 받아오기
    const user = await prisma.USER.findMany({
      where: {
        username,
      },
    });
    await prisma.$disconnect();

    if (!errors.isEmpty()) {
      const error = new ValidError();
      // console.log(errors);
      throw error;
    }

    // ERR 400 : 아이디, 이메일 미존재
    if (user.length === 0) {
      const error = new CustomError(ErrorTypes.UserUsernameExistError);
      throw error;
    }
    // 조회 : 암호화된 비밀번호
    const passwordValue = user[0].password; // user[{}] 형태

    // bcrypt.compare(사용자가 로그인 시 입력한 비밀번호, DB에 저장된 암호화 비밀번호) :
    const equalPassword = await bcrypt.compare(password, passwordValue);

    // ERR 404 : 비밀번호 불일치
    if (!equalPassword) {
      const error = new CustomError(ErrorTypes.UserPwMismatchError);
      throw error;
    }
    // 로그인 성공 시 토큰 생성
    // jwt.sign({payload},"암호키",{expiresIn: 유효 시간}) : 토큰 생성
    const token = await jwt.sign({ username }, process.env.PRIVATE_KEY, {
      expiresIn: '12h',
    });
    res.cookie('authorization', `Bearer ${token}`);

    // res.status(200).json({ token: token });
    res.redirect('/api/posts');
  } catch (error) {
    // return res.status(401).json({ message: error.message });
    console.log(error);
    next(error);
  }
});

// LOGOUT
router.get('/logout', authMiddleware, async (req, res, next) => {
  try {
    res.clearCookie('authorization');
    // res.status(200).json({ message: '로그아웃 성공' });
    res.redirect('/api/posts');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
