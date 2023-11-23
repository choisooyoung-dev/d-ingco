const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); // [이아영] body값 조회 패키지
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const prisma = new PrismaClient();
const bcrypt = require('bcrypt'); // [이아영] 암호 해시화 패키지
const { CustomError, ErrorTypes } = require('../../lib/error.handler');

// 회원 정보 저장(CREATE)

router.post('/signup', async (req, res) => {
  // body 값 조회
  const { name, user_name, email, pw, confirmPw } = req.body;

  try {
    // ERR 400 : 아이디 중복
    const existsUsername = await prisma.USER.findUnique({
      where: { user_name },
    });

    if (existsUsername)
      throw new CustomError(
        ErrorTypes.UserUsernameExistError,
        '중복된 아이디 입니다.',
      );

    // ERR 400 : 이메일 중복
    const existsEmail = await prisma.USER.findUnique({
      where: { email },
    });

    if (existsEmail)
      throw new CustomError(
        ErrorTypes.UserEmailExistError,
        '중복된 이메일 입니다.',
      );

    if (pw !== confirmPw)
      throw new CustomError(
        ErrorTypes.UserConfirmPwMismatchError,
        '똑같은 비밀번호를 입력해주세요.',
      );

    if (pw.length < 6)
      throw new CustomError(
        ErrorTypes.UserPwLengthError,
        '비밀번호는 6자 이상 작성해주세요.',
      );

    const salt = await bcrypt.genSalt(12);

    // 저장 : 비밀번호 암호화
    // await bcrypt.hash(비밀번호, 길이); : 비밀번호를 암호화
    const new_sign_password = await bcrypt.hash(pw, salt);
    // 저장 : 회원정보
    const createUser = async () => {
      const user = await prisma.USER.create({
        data: {
          user_name,
          pw: new_sign_password,
          name,
          email,
        },
      });
      return user;
    };
    await createUser();
    await prisma.$disconnect();
    res.status(201).json({ user_info: { user_name, name, email } });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

module.exports = router;
