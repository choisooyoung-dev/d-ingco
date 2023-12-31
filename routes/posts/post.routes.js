const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authMiddleware = require('../../middlewares/auth.middleware.js');
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const {
  CustomError,
  ErrorTypes,
  ValidError,
} = require('../../lib/CustomError.js');
const { postValidate } = require('../../middlewares/validator.js');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

router.get('/images/:imageName', function (req, res) {
  var imgName = req.params.imageName;
  console.log('이미지 요청: ' + imgName);
  res.sendFile('/public/image/' + imgName);
});

router.get('/create', async (req, res, next) => {
  try {
    res.render('index', {
      path: '/api/posts/create',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/edit/:post_id', async (req, res, next) => {
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
      const error = new CustomError(ErrorTypes.PostNotExistError);
      throw error;
    }
    res.render('index', {
      data: { post: post },
      path: '/api/posts/edit',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 게시글 저장
router.post('/', authMiddleware, postValidate, async (req, res, next) => {
  const errors = validationResult(req);
  try {
    const { title, content } = req.body; // body 값 조회
    const { user_id } = res.locals.user[0]; // user_id 조회
    // console.log(user_id);
    if (!errors.isEmpty()) {
      const error = new ValidError();
      throw error;
    }

    // 회원 번호 저장 미구현
    // user_id가 외래키로 설정되었기 때문에 게시글을 저장할 때 입력된 user_id 값이 USER 테이블에 값이 없을 경우 오류가 발생함
    const post = await prisma.POST.create({
      data: {
        user_id,
        title,
        content,
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res
      .status(201)
      .json({ success: true, message: '게시글 저장이 완료되었습니다!', post: post });
  } catch (error) {
    // console.log(error);
    next(error);
  }
});

// 게시글 전체 조회
router.get('/', async (req, res, next) => {
  // console.log(req.params.post_id);
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
      const error = new Error('전체 조회에 실패했습니다.');
      throw error;
    }

    const descSortedPost = posts.reverse();

    res.render('index', {
      data: descSortedPost,
      path: '/api/posts',
    });

    //return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    //res.status(400).json({ errorMessage: error.message });
    next(error);
  }
});

// 게시글 검색
router.get('/search/:searchKeyword', async (req, res, next) => {
  try {
    console.log("검색실행됨");
    const { searchKeyword } = req.params;
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
        OR: [
          {
            title: {
              contains: searchKeyword,
            }
          },
          {
            content: {
              contains: searchKeyword,
            }
          }
        ]
      },
    });
    if (!post) {
      const error = new CustomError(ErrorTypes.PostNotExistError);
      throw error;
    }
    res.render('index', { data: post.reverse() });
    res.status(200).json({ post });

  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 게시글 상세 페이지 렌더링 라우터
// html 페이지를 json으로 파싱하려고 하기 때문에 따로 분리해줘야한다고 함
router.get('/detail/:post_id', async (req, res, next) => {
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
      const error = new CustomError(ErrorTypes.PostNotExistError);
      throw error;
    }
    const comments = await prisma.COMMENT.findMany({
      where: {
        post_id: +post_id,
      },
    });
    const descComments = comments.reverse();
    const combinedData = {
      post: post,
      comments: descComments,
    };
    return res.render('index', {
      data: combinedData,
      path: '/api/posts/detail',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 게시글 상세 조회(데이터 가저오는 라우터)
router.get('/:post_id', async (req, res, next) => {
  try {
    const { post_id } = req.params;

    // jwt에서 user_id 추출하기
    const { authorization } = req.cookies;
    // jwt 토큰이 있을 경우 실행
    if (authorization) {
      const [tokenType, token] = authorization.split(' ');
      const test = jwt.verify(token, process.env.PRIVATE_KEY);
      if (token) {
        jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
          if (err) {
            return res
              .status(401)
              .json({ success: false, message: '인증되지 않은 토큰입니다.' });
          }
          res.locals.user = decoded;
        });
      } else {
        res.locals.user = '';
      }
    }

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
      const error = new CustomError(ErrorTypes.PostNotExistError);
      throw error;
    }

    const username = res.locals.user ? res.locals.user.username : 'none';
    console.log('username: ', username);

    res.status(200).json({
      post,
      username,
    });
  } catch (error) {
    console.log(error);
    // return res.status(404).json({ message: error.message });
    next(error);
  }
});


// 게시글 수정
router.put(
  '/:post_id',
  authMiddleware,
  postValidate,
  async (req, res, next) => {
    const errors = validationResult(req);
    try {
      const { user_id } = res.locals.user[0]; // user_id 조회
      const { post_id } = req.params;
      const { title, content } = req.body; // body 값 조회

      if (!errors.isEmpty()) {
        const error = new ValidError();
        throw error;
      }

      // 게시글 수정
      await prisma.POST.update({
        where: {
          post_id: +post_id,
        },
        data: {
          title: title,
          content: content,
        },
      });

      // ERR 403 : 글 작성자가 아닌 경우
      // 조건문 보강 필요할 것으로 생각됨
      const equalUser = await prisma.POST.findUnique({
        where: {
          post_id: +post_id,
          user_id: +user_id,
        },
      });

      if (!equalUser) {
        const error = new CustomError(ErrorTypes.TokenUserDoesNotExistError);
        throw error;
      }

      // 게시글 수정
      const post = await prisma.POST.update({
        where: {
          post_id: +post_id,
        },
        data: {
          title: title,
          content: content,
        },
      });
      await prisma.$disconnect(); // prisma 연결 끊기
      res.status(200).json({ success: true, message: '수정이 완료되었습니다!' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

// 게시글 삭제
router.delete('/:post_id', authMiddleware, async (req, res, next) => {
  try {
    const { user_id } = res.locals.user[0]; // user_id 조회
    const { post_id } = req.params;

    const post = await prisma.POST.findUnique({
      where: {
        post_id: +post_id,
      },
    });

    if (!post) {
      const error = new CustomError(ErrorTypes.PostNotExistError);
      throw error;
    }

    // ERR 403 : 글 작성자가 아닌 경우
    const equalUser = await prisma.POST.findUnique({
      where: {
        post_id: +post_id,
        user_id: +user_id,
      },
    });
    if (!equalUser) {
      const error = new CustomError(ErrorTypes.TokenUserDoesNotExistError);
      throw error;
    }

    await prisma.POST.delete({
      where: {
        // 회원 번호 식별 기능 미구현
        post_id: +post_id
      },
    });
    res.status(200).json({ success: true, message: '삭제가 완료되었습니다!' });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
