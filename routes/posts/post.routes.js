const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware.js');
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const { CustomError, ErrorTypes } = require('../../lib/error.handler.js');
const prisma = new PrismaClient();

// 게시글 저장
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body; // body 값 조회
    const { user_id } = res.locals.user[0]; // user_id 조회

    // ERR 400 : 제목 미입력
    if (!title) {
      throw new Error('400-제목미입력');
    }
    // ERR 400 : 내용 미입력
    if (!content) {
      throw new Error('400-내용미입력');
    }

    // 회원 번호 저장 미구현
    // user_id가 외래키로 설정되었기 때문에 게시글을 저장할 때 입력된 user_id 값이 USER 테이블에 값이 없을 경우 오류가 발생함
    await prisma.POST.create({
      data: {
        user_id,
        title,
        content,
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(201).json({ Message: '게시글 저장이 완료되었습니다~' });
  } catch (error) {
    console.log(error);
    if (error.message === '400-제목미입력') {
      res.status(400).json({ errorMessage: '제목을 입력해주세요.' });
    } else if (error.message === '400-내용미입력') {
      res.status(400).json({ errorMessage: '내용을 입력해주세요.' });
    }
  }
});

// 게시글 전체 조회 (git push 할 때 정혁님 코드 다시 활성화 하기)
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.POST.findMany({
      select: {
        post_id: true,
        title: true,
        content: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!posts || posts.lenth == 0) {
      throw new Error('전체 조회에 실패했습니다.');
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(400).json({ errorMessage: error.message });
  }
});

// 게시글 상세 조회
router.get('/:post_id', async (req, res) => {
  try {
    const { post_id } = req.params;
    const post = await prisma.POST.findMany({
      select: {
        post_id: true,
        title: true,
        content: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      where: {
        post_id: +post_id,
      },
    });
    if (!post) {
      throw new CustomError(
        ErrorTypes.PostNotExistError,
        '게시글이 존재하지 않습니다.',
      );
    }
    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
});

// 게시글 수정
router.put('/:post_id', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user[0]; // user_id 조회
    const { post_id } = req.params;
    const { title, content } = req.body; // body 값 조회
    // ERR 400 : 제목 미입력
    if (!title) {
      throw new Error('400-제목미입력');
    }
    // ERR 400 : 내용 미입력
    if (!content) {
      throw new Error('400-내용미입력');
    }

    // ERR 403 : 글 작성자가 아닌 경우
    const equalUser = await prisma.POST.findUnique({
      where: {
        post_id: +post_id,
        user_id: +user_id,
      },
    });

    if (!equalUser) {
      throw new Error('403-권한없음');
    }

    // 게시글 수정
    await prisma.POST.update({
      where: {
        post_id: +post_id,
      },
      data: {
        title: title,
        content: content,
        // 수정 시간만 업데이트 되기 기능 추가 필요한데
        // 다른 기능들 만들고 오자..ㅜ
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(201).json({ Message: '수정이 완료되었습니다~' });
  } catch (error) {
    if (error.message === '400-제목미입력') {
      res.status(400).json({ errorMessage: '제목을 입력해주세요.' });
    } else if (error.message === '400-내용미입력') {
      res.status(400).json({ errorMessage: '내용을 입력해주세요.' });
    } else if (error.message === '403-권한없음') {
      return res.status(404).json({ errorMessage: '권한이 없습니다.' });
    } else {
      console.log(error);
    }
  }
});

// 게시글 삭제
router.delete('/:post_id', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user[0]; // user_id 조회
    const { post_id } = req.params;

    // ERR 404 : 게시글이 없을 경우(없을 수 없긴 한데 만들어두자) 아무리 생각해도 안쓸듯?

    const post = await prisma.POST.findUnique({
      where: {
        post_id: +post_id,
      },
    });

    if (!post) {
      throw new CustomError(
        ErrorTypes.PostNotExistError,
        '게시글이 존재하지 않습니다.',
      );
    }

    // ERR 403 : 글 작성자가 아닌 경우
    const equalUser = await prisma.POST.findUnique({
      where: {
        post_id: +post_id,
        user_id: +user_id,
      },
    });
    if (!equalUser) {
      throw new Error('403-권한없음');
    }

    await prisma.POST.delete({
      where: {
        // 회원 번호 식별 기능 미구현
        post_id: +post_id,
      },
    });
    res.status(200).json({ errorMessage: "삭제가 완료되었습니다!" });

  } catch (error) {
    // 에러처리 수정해야함 - 수영
    if (error.message === '404-게시글미존재') {
      return res
        .status(404)
        .json({ errorMessage: '게시글이 존재하지 않습니다.' });
    } else if (error.message === '403-권한없음') {
      return res.status(404).json({ errorMessage: '권한이 없습니다.' });
    } else {
      console.log(error);
    }
  }
});

module.exports = router;
