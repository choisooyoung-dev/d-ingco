const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client'); // [이아영] 프리즈마 패키지
const { CustomError, ErrorTypes } = require('../lib/error.handler');
const prisma = new PrismaClient();
require('dotenv').config();
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    // 토큰 값 받지 않았을 때, 로그인 필요 시
    if (!authorization) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const [tokenType, token] = authorization.split(' ');

    // 토큰 타입이 일치하지 않을 때
    if (tokenType !== 'Bearer') { }
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    const username = decodedToken.username;
    const user = await prisma.USER.findMany({
      where: {
        username,
      },
    });
    // const user = await Users.findOne({ where: { userId } });
    // 토큰 사용자가 존재하지 않을 때
    if (!user) { }

    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);

  }
};
