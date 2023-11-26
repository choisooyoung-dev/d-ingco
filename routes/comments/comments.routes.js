const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware.js');
const { PrismaClient } = require('@prisma/client');
const {
  CustomError,
  ErrorTypes,
  ValidError,
} = require('../../lib/CustomError.js');
const { commentValidate } = require('../../middlewares/validator.js');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

// 댓글 생성
router.post('/:post_id/comments', authMiddleware, commentValidate, async (req, res, next) => {
  const errors = validationResult(req);
  try {
    const post_id = parseInt(req.params.post_id);
    const { user_id } = res.locals.user[0];
    const { comment_content } = req.body;
    if (!errors.isEmpty()) {
      const error = new ValidError();
      throw error;
    }
    const commentUser = await prisma.USER.findFirst({
      where: {
        user_id: +user_id,
      },
    });
    const comment = await prisma.COMMENT.create({
      data: {
        post_id,
        user_id,
        comment_name : commentUser.username,
        comment_content,
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    return res.status(201).json({ data: comment });
  } catch (error) {
    next(error);
  }
});

// 댓글 조회
router.get('/:post_id/comments', async (req, res) => {
  try {
    const post_id = parseInt(req.params.post_id);
    const comments = await prisma.COMMENT.findMany({
      where: {
        post_id: +post_id,
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(200).json({ data: comments });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// 댓글 수정
router.put('/:post_id/comments', authMiddleware, commentValidate, async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id } = res.locals.user[0];
    const { comment_id, comment_content } = req.body;
    const numberComment_id = parseInt(comment_id);
    const commentUser = await prisma.COMMENT.findFirst({
      where: {
        comment_id: +numberComment_id,
        user_id: +user_id,
      },
    });
    const editComment = await prisma.COMMENT.update({
      where: {
        comment_id: +numberComment_id,
      },
      data: {
        comment_content,
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    return res.status(201).json({ data: editComment });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// 댓글 삭제
router.delete('/:post_id/comments', authMiddleware, async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id } = res.locals.user[0];
    const { comment_id } = req.body;
    const numberComment_id = parseInt(comment_id);
    const commentUser = await prisma.COMMENT.findFirst({
      where: {
        comment_id: +numberComment_id,
        user_id: +user_id,
      },
    });
    const deleteComment = await prisma.COMMENT.delete({
      where: {
        comment_id: +numberComment_id,
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    return res.status(201).json({ message: "삭제 완료" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
