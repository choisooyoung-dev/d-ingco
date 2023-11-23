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
      throw new CustomError(
        ErrorTypes.LoginRequiredError,
        '로그인이 필요합니다.',
      );
    }

    const [tokenType, token] = authorization.split(' ');

    // 토큰 타입이 일치하지 않을 때
    if (tokenType !== 'Bearer') {
      throw new CustomError(
        ErrorTypes.TokenTypeMismatchError,
        '인증 토큰 타입이 일치하지 않습니다.',
      );
    }
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    const user_name = decodedToken.user_name;

    const user = await prisma.USER.findMany({
      where: {
        user_name,
      },
    });

    await prisma.$disconnect();

    // 토큰 사용자가 존재하지 않을 때
    if (!user) {
      throw new CustomError(
        ErrorTypes.TokenUserDoesNotExistError,
        '권한이 없습니다.',
      );
    }

    res.locals.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
