const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser'); // [이아영] body값 조회 패키지
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const prisma = new PrismaClient();
const bcrypt = require('bcrypt'); // [이아영] 암호 해시화 패키지

// 회원 정보 저장(CREATE)
app.post('/signup', async (req, res) => {
  const { sign_username, sign_password, sign_name, sign_email } = req.body; // body 값 조회
  console.log('sign_username, sign_password, sign_name, sign_email: ', sign_username, sign_password, sign_name, sign_email);

  try {
    // ERR 400 : 아이디 중복
    const existsUsername = await prisma.USER.findUnique({
      where: { user_name: sign_username },
    });
    if (existsUsername) { throw new Error("400-아이디중복"); }

    // ERR 400 : 이메일 중복
    const existsEmail = await prisma.USER.findUnique({
      where: { email: sign_email },
    });
    if (existsEmail) { throw new Error("400-이메일중복"); }


    // ERR 400 : 비밀번호 불일치
    // if (sign_password !== confirsign_password) { throw new Error("400-비밀번호불일치"); }

    // ERR 400 : 비밀번호 최소 길이 불충족 
    if (sign_password.length < 6) { throw new Error("400-비밀번호길이"); };

    // 저장 : 비밀번호 암호화
    // await bcrypt.hash(비밀번호, 길이); : 비밀번호를 암호화
    const new_sign_password = await bcrypt.hash(sign_password, 10);
    // 저장 : 회원정보
    const createUser = async () => {
      const user = await prisma.USER.create({
        data: {
          user_name: sign_username,
          pw: new_sign_password,
          name: sign_name,
          email: sign_email
        }
      });
      return user;
    };
    await createUser();
    await prisma.$disconnect();

    res.status(201).json({ user_info: { sign_username, sign_name, sign_email } });
  } catch (error) {
    console.log(error);
    // SequelizeValidationError : Models의 유효성 검사 에러
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message.replace('Validation error: ', ''));
      return res.status(400).json({ errorMessage: validationErrors });
    }
    else if (error.message === "400-아이디중복") {
      return res.status(400).json({ errorMessage: "이미 등록된 아이디입니다." });
    }
    else if (error.message === "400-이메일중복") {
      return res.status(400).json({ errorMessage: "이미 등록된 이메일입니다." });
    }
    else if (error.message === "400-비밀번호불일치") {
      return res.status(400).json({ errorMessage: "비밀번호와 비밀번호 확인에 입력한 값이 일치하지 않습니다." });
    }
    else if (error.message === "400-비밀번호길이") {
      return res.status(400).json({ errorMessage: "비밀번호는 6자 이상 입력해주세요." });
    }
  }
});

module.exports = router;