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
  // console.log(validationResult(req));
  const { username, password, confirmPassword, name, email } = req.body; // body 값 조회

  try {
    // ERR 400 : 아이디 중복
    const existsUsername = await prisma.USER.findUnique({
      where: { username: username },
    });

    if (!errors.isEmpty()) {
      const error = new ValidError();
      throw error;
    }

    if (existsUsername) {
      const error = new CustomError(ErrorTypes.UserUsernameExistError);
      throw error;
    }

    // ERR 400 : 이메일 중복
    const existsEmail = await prisma.USER.findUnique({
      where: { email: email },
    });
    if (existsEmail) {
      const error = new CustomError(ErrorTypes.UserEmailExistError);
      throw error;
    }

    // ERR 400 : 이메일 형식 에러
    // const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    // const result = pattern.test(email);
    // if (!result) {
    //   throw new Error('99-400-이메일을 형식에 맞춰서 작성해주시기 바랍니다.');
    // }

    // ERR 400 : 비밀번호 불일치
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
        username: username,
        password: new_password,
        name: name,
        email: email,
      },
    });
    await prisma.$disconnect();
    res.status(201).json({ user_info: { username, name, email } });
  } catch (error) {
    //console.log(error);
    next(error);
  }
});

module.exports = router;
