const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); // [이아영] body값 조회 패키지
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const prisma = new PrismaClient();
const bcrypt = require('bcrypt'); // [이아영] 암호 해시화 패키지
const {
  CustomError,
  ErrorTypes,
  ValidError,
} = require('../../lib/CustomError');
const { userSignupValidate } = require('../../middlewares/validator');
const { validationResult } = require('express-validator');

router.get('/signup', async (req, res, next) => {
  try {
    res.render('index', {
      path: '/api/users/signup',
      user: '',
    });
  } catch (error) {
    console.log(error);
  }
});

// 회원 정보 저장(CREATE)
router.post('/signup', userSignupValidate, async (req, res, next) => {
  const errors = validationResult(req);
  const { username, password, confirmPassword, name, email } = req.body; // body 값 조회
  console.log('req.body: ', req.body);

  try {
    // 입력하지 않은 값이 있을 경우;
    if (!errors.isEmpty()) {
      const error = new ValidError();
      throw error;
    }

    // 아이디 중복
    const existsUsername = await prisma.USER.findUnique({
      where: { username },
    });

    if (existsUsername) {
      const error = new CustomError(ErrorTypes.UserUsernameExistError);
      throw error;
    }

    // 이메일 중복
    const existsEmail = await prisma.USER.findUnique({
      where: { email },
    });
    if (existsEmail) {
      const error = new CustomError(ErrorTypes.UserEmailExistError);
      throw error;
    }

    // 비밀번호 불일치
    if (password !== confirmPassword) {
      const error = new CustomError(ErrorTypes.UserConfirmPwMismatchError);
      throw error;
    }

    // 저장 : 비밀번호 암호화
    // await bcrypt.hash(비밀번호, 길이); : 비밀번호를 암호화
    const salt = await bcrypt.genSalt(12);
    const new_password = await bcrypt.hash(password, salt);

    // 저장 : 회원정보
    const user = await prisma.USER.create({
      data: {
        username,
        password: new_password,
        name,
        email,
      },
    });
    await prisma.$disconnect();
    res.redirect('/api/posts');
  } catch (error) {
    //console.log(error);
    next(error);
  }
});

module.exports = router;
