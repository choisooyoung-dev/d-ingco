const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware.js');
const { PrismaClient } = require('@prisma/client');
const { CustomError, ErrorTypes } = require('../../lib/error.handler.js');
const prisma = new PrismaClient();

// 댓글 생성
router.post('/:post_id/comments', authMiddleware, async (req, res) => {
    try {
      const { post_id } = req.params;
      const { user_id } = res.locals.user[0];
      const { comment_content } = req.body;
      const comment = await prisma.COMMENT.create({
        data: {
          post_id,
          user_id,
          comment_content
        },
      });
      await prisma.$disconnect(); // prisma 연결 끊기
      return res.status(201).json({ data: comment });

    } catch (error) {

    }
});

// 댓글 조회
router.get('/:post_id/comments', async (req, res) => {
    try {

    } catch (error) {
        
    }
});

// 댓글 수정
router.put('/:post_id/comments', authMiddleware, async (req, res) => {
    try {

    } catch (error) {
        
    }
});


// 댓글 삭제
router.delete('/:post_id/comments', authMiddleware, async (req, res) => {
    try {

    } catch (error) {
        
    }
});

module.exports = router;