const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../../middlewares/auth.middleware');

// 내 정보 조회 API
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user[0]; // user_id 조회
    const user = await prisma.USER.findUnique({
      select: {
        username: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
      where: { user_id },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    if (!user) res.status(400).json({ errorMessage: '유저가 없습니다.' });
    return res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
  }
});

// 내 정보 수정 API
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user[0]; // user_id 조회
    const { username, name, email } = req.body;

    const user = await prisma.USER.update({
      where: {
        user_id
      },
      data: {
        username,
        name,
        email,
      },
    });
    await prisma.$disconnect(); // prisma 연결 끊기
    res.status(201).json({ Message: '수정이 완료되었습니다~' });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;