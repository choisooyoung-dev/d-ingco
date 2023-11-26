const jwt = require('jsonwebtoken');

// 게시글 상세조회에서 수정하기, 삭제하기 버튼이 유저 토큰값과 작성자가 일치한지에 따라 확인하기 위해서 만들어뒀습니다.
// 서버에서 토큰 검증 및 사용자 정보 제공을 위한 미들웨어 입니다.
// auth.middleware랑은 다른 역할이기 때문에 따로 빼뒀습니다.
// 나중에 합칠 수 있는 방법을 찾아봅시다..ㅎ

const verifyToken = (req, res, next) => {
  const token = req.cookies.authorization;

  if (token) {
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: '인증되지 않은 토큰입니다.' });
      }
      req.user = decoded;
      next();
    });
  } else {
    req.user = '';
    return next();
  }
};

module.exports = verifyToken;
