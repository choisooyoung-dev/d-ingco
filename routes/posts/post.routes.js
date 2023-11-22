const express = require('express');
const app = express();
const router = express.Router();

const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const e = require('express');
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

// 게시글 전체 조회(html에서 어케 그리냐,, map..?)
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.POST.findMany();
    res.status(200).json({ posts });
  } catch (error) {
    console.log(error);
  }
});

// 게시글 상세 조회
router.get('/:post_id', async (req, res) => {
  try {
    const { post_id } = req.params;
    console.log('post_id: ', post_id);
    const post = await prisma.POST.findUnique({
      where: {
        post_id: +post_id
      }
    });
    if (!post) {
      throw new Error("404-게시글미존재");
    }
    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    if (error.message === "404-게시글미존재") {
      return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
  }
});

// 게시글 수정
router.put('/:post_id', async (req, res) => {
  try {
    // 게시글 번호, 사용자 번호 필요, 사용자 인증이 일치할 경우에 업데이트
    // 근데 애초에 사용자 본인이 아닐 경우엔 수정하기 버튼을 비활성화 해야 할 것으로 생각됨
    const { post_id } = req.params;
    const { title, content } = req.body; // body 값 조회
    // ERR 400 : 제목 미입력
    if (!title) {
      throw new Error("400-제목미입력");
    }
    // ERR 400 : 내용 미입력
    if (!content) {
      throw new Error("400-내용미입력");
    }

    // 게시글 수정
    const updatePost = async () => {
      const post = await prisma.POST.update({
        where: {
          post_id: +post_id,
          user_id: 0
        },
        data: {
          title: title,
          content: content,
        }
      });
      return post;
    };
    await updatePost();
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(201).json({ Message: "수정이 완료되었습니다~" });
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
router.delete('/:post_id', async (req, res) => {
  try {
    const { post_id } = req.params;
    console.log('post_id: ', post_id);

    // ERR 404 : 게시글이 없을 경우(없을 수 없긴 한데 만들어두자)
    const post = await prisma.POST.findUnique({
      where: {
        post_id: +post_id
      }
    });
    if (!post) {
      throw new Error("404-게시글미존재");
    }

    const deleteUser = await prisma.POST.delete({
      where: {
        // 회원 번호 식별 기능 미구현
        post_id: +post_id,
        user_id: 0
      }
    });
    console.log('deleteUser: ', deleteUser);
  } catch (error) {
    console.log(error);
    if (error.message === "404-게시글미존재") {
      return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
    }
  }
});

module.exports = router;