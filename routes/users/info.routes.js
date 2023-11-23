const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 내 정보 조회 API
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await prisma.USER.findUnique({
    select: {
      user_name: true,
      name: true,
      created_at: true,
      updated_at: true,
    },
    where: { user_id: Number(userId) },
  });

  if (user) return res.status(200).json({ data: user });
});

module.exports = router;