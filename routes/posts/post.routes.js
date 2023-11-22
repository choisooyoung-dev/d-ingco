const express = require('express');
const app = express();
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const prisma = new PrismaClient();

// 게시글 저장
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body; // body 값 조회
    // ERR 400 : 제목 미입력
    if (!title) {
      throw new Error("400-제목미입력");
    }
    // ERR 400 : 내용 미입력
    if (!content) {
      throw new Error("400-내용미입력");
    }
    // 회원 번호 저장 미구현
    const createPost = async () => {
      const post = await prisma.POST.create({
        data: {
          user_id: 0,
          title: title,
          content: content,
        }
      });
      return post;
    };
    await createPost(); // 여기가 문제라는데?
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(201).json({ Message: "저장이 완료되었습니다~" });
  } catch (error) {
    console.log(error);
    if (error.message === "400-제목미입력") {
      res.status(400).json({ errorMessage: "제목을 입력해주세요." });
    } else if (error.message === "400-내용미입력") {
      res.status(400).json({ errorMessage: "내용을 입력해주세요." });
    }
  }
});


// 게시글 수정
router.put('/', async (req, res) => {
  try {
    // 게시글 번호, 사용자 번호 필요, 사용자 인증이 일치할 경우에 업데이트
    // 근데 애초에 사용자 본인이 아닐 경우엔 수정하기 버튼을 비활성화 해야 할 것으로 생각됨
    // 게시글 조회 후 수정 기능을 만들어야겠음
    const { title, content } = req.body; // body 값 조회
    // ERR 400 : 제목 미입력
    if (!title) {
      throw new Error("400-제목미입력");
    }
    // ERR 400 : 내용 미입력
    if (!content) {
      throw new Error("400-내용미입력");
    }
    // 회원 번호 저장 미구현
    const createPost = async () => {
      const post = await prisma.POST.update({
        data: {
          user_id: 0,
          title: title,
          content: content,
        }
      });
      return post;
    };
    await createPost(); // 여기가 문제라는데?
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(201).json({ Message: "저장이 완료되었습니다~" });
  } catch (error) {
    console.log(error);
    if (error.message === "400-제목미입력") {
      res.status(400).json({ errorMessage: "제목을 입력해주세요." });
    } else if (error.message === "400-내용미입력") {
      res.status(400).json({ errorMessage: "내용을 입력해주세요." });
    }
  }
});

// 게시글 삭제


module.exports = router;