const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 내 정보 조회 API
router.get('/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  const user = await prisma.USER.findUnique({
    select: {
      username: true,
      name: true,
      created_at: true,
      updated_at: true,
    },
    where: { user_id },
  });

  if (user) return res.status(200).json({ success: true, data: user });
});

module.exports = router;
