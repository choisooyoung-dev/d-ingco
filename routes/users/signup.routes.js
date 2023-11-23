const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser'); // [이아영] body값 조회 패키지
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const prisma = new PrismaClient();
const bcrypt = require('bcrypt'); // [이아영] 암호 해시화 패키지
const { CustomError, ErrorTypes } = require('../../lib/error.handler');

// 회원 정보 저장(CREATE)
router.post('/signup', async (req, res) => {
  console.log('SIGNUP ROUTER');
  const { username, password, confirmPassword, name, email } = req.body; // body 값 조회

  try {
    // ERR 400 : 모든 값 입력 확인
    if (!username || !password || !confirmPassword || !name || !email) {
      throw new Error('99-400-모든 항목을 입력해주세요.');
    }
    // ERR 400 : 아이디 중복
    const existsUsername = await prisma.USER.findUnique({
      where: { user_name: username },
    });
    if (existsUsername) {
      throw new Error('99-400-이미 등록된 아이디입니다.');
    }

    // ERR 400 : 이메일 중복
    const existsEmail = await prisma.USER.findUnique({
      where: { email: email },
    });
    if (existsEmail) {
      throw new Error('99-400-이미 등록된 이메일입니다.');
    }

    // ERR 400 : 이메일 형식 에러
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    const result = pattern.test(email);
    if (!result) {
      throw new Error('99-400-이메일을 형식에 맞춰서 작성해주시기 바랍니다.');
    }

    // ERR 400 : 비밀번호 불일치
    if (password !== confirmPassword) {
      throw new Error(
        '99-400-비밀번호와 비밀번호 확인에 입력한 값이 일치하지 않습니다.',
      );
    }

    // ERR 400 : 비밀번호 최소 길이 불충족
    if (password.length < 6) {
      throw new Error('99-400-비밀번호는 6자 이상 입력해주세요.');
    }

    // 저장 : 비밀번호 암호화
    // await bcrypt.hash(비밀번호, 길이); : 비밀번호를 암호화
    const salt = await bcrypt.genSalt(12);
    const new_password = await bcrypt.hash(password, salt);

    // 저장 : 회원정보
    const user = await prisma.USER.create({
      data: {
        user_name: username,
        pw: new_password,
        name: name,
        email: email,
      },
    });
    await prisma.$disconnect();
    res.status(201).json({ user_info: { username, name, email } });
  } catch (error) {
    console.log(error);
    const result = error.message.split('-');
    if (result[0] === '99')
      return res.status(result[1]).json({ errorMessage: result[2] });

    return res.status(500).json({ errorMessage: '알 수 없는 에러' });
  }
});

module.exports = router;
