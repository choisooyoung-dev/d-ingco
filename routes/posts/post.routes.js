const express = require('express');
const app = express();
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const prisma = new PrismaClient();

// 게시글 저장
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body; // body 값 조회

    // 조회 : 회원 정보
    // id로 검색하고 pw 값 받아오기
    const user = await prisma.USER.findUnique({
      where: {
        user_name: username
      }
    });

    // ERR 400 : 아이디, 이메일 미존재
    if (!user) { throw new Error("400-아이디미존재"); }
    // 조회 : 암호화된 비밀번호
    const passwordValue = user.pw;
    // bcrypt.compare(사용자가 로그인 시 입력한 비밀번호, DB에 저장된 암호화 비밀번호) : 
    const equalPassword = await bcrypt.compare(password, passwordValue);
    console.log('equalPassword: ', equalPassword);

    // ERR 404 : 비밀번호 불일치
    if (!equalPassword) { throw new Error("400-비밀번호불일치"); }

  } catch (error) {
    if (error.message === "400-") {
      res.status(400).json({ errorMessage: "400" });
    } else if (error.message === "402-") {
      res.status(400).json({ errorMessage: "402" });
    }
  }
});

// 게시글 조회(html에서 어케 그리냐,, map..?)


// 게시글 상세 조회


// 게시글 수정


// 게시글 삭제
module.exports = router;