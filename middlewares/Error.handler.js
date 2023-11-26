const { validationResult } = require('express-validator');

const ErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidError') {
    const errors = validationResult(req);
    const path = errors.array()[0].path;
    if (path === 'name') {
      return res
        .status(404)
        .json({ message: '이름은 1글자 이상 입력해주세요.' });
    }
    if (path === 'username') {
      return res
        .status(404)
        .json({ message: '아이디는 1글자 이상 입력해주세요.' });
    }
    if (path === 'email') {
      return res
        .status(404)
        .json({ message: '이메일 형식에 올바르지 않습니다.' });
    }
    if (path === 'password') {
      return res
        .status(404)
        .json({ message: '비밀번호는 6자 이상 필요합니다.' });
    }
    if (path === 'confirmPassword') {
      return res
        .status(404)
        .json({ message: '동일한 비밀번호를 입력해주세요.' });
    }
    if (path === 'title') {
      return res.status(404).json({ message: '제목을 입력해주세요.' });
    }
    if (path === 'content') {
      return res.status(404).json({ message: '내용을 입력해주세요.' });
    }
  }

  if (err.name === 'CustomError') {
    if (err.type === 'UsernameExistError') {
      return res.status(404).json({ message: '이미 존재하는 아이디입니다.' });
    }
    if (err.type === 'UserEmailExistError') {
      return res.status(404).json({ message: '이미 존재하는 이메일입니다.' });
    }

    if (err.type === 'UserUsernameNotExistError') {
      return res
        .status(404)
        .json({ message: '해당 아이디가 존재하지 않습니다.' });
    }
    if (err.type === 'UserPwMismatchError') {
      return res.status(404).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    if (err.type === 'LoginRequiredError') {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    if (err.type === 'TokenTypeMismatchError') {
      return res
        .status(401)
        .json({ message: '토큰 타입이 일치하지 않습니다.' });
    }
    if (err.type === 'TokenUserDoesNotExistError') {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }
    if (err.type === 'PostNotExistError') {
      return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
    }
  }
};

module.exports = { ErrorHandler };
