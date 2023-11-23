const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const prisma = new PrismaClient();
const bcrypt = require('bcrypt'); // [이아영] 암호 해시화 패키지
const authMiddleware = require('../../middlewares/auth.middleware');
const { CustomError, ErrorTypes } = require('../../lib/error.handler');

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const { user_name, pw } = req.body; // body 값 조회

    // 조회 : 회원 정보
    // id로 검색하고 pw 값 받아오기
    const user = await prisma.USER.findMany({
      where: {
        user_name,
      },
    });
    await prisma.$disconnect();
    // ERR 400 : 아이디, 이메일 미존재
    if (user.length === 0)
      throw new CustomError(
        ErrorTypes.UserUsernameExistError,
        '해당 아이디의 유저가 존재하지 않습니다.',
      );

    // 조회 : 암호화된 비밀번호
    const passwordValue = user[0].pw; // user[{}] 형태

    // bcrypt.compare(사용자가 로그인 시 입력한 비밀번호, DB에 저장된 암호화 비밀번호) :
    const equalPassword = await bcrypt.compare(pw, passwordValue);

    // ERR 404 : 비밀번호 불일치
    if (!equalPassword)
      throw new CustomError(
        ErrorTypes.UserPwMismatchError,
        '비밀번호가 일치하지 않습니다.',
      );

    // 로그인 성공 시 토큰 생성
    // jwt.sign({payload},"암호키",{expiresIn: 유효 시간}) : 토큰 생성
    const token = await jwt.sign({ user_name }, process.env.PRIVATE_KEY, {
      expiresIn: '12h',
    });
    res.cookie('authorization', `Bearer ${token}`); // res.cookie("Authorization", `Bearer ${token}`) : 쿠키에 토큰 저장
    res.status(200).json({ token: token });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

// LOGOUT
router.get('/logout', authMiddleware, async (req, res, next) => {
  try {
    res.clearCookie('authorization');
    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
