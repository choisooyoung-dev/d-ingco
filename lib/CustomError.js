const ErrorTypes = {
  // USER
  // SIGNUP

  // 아이디(user_name) 중복
  UserUsernameExistError: 'UsernameExistError',

  // 이메일 중복
  UserEmailExistError: 'UserEmailExistError',

  // 비밀번호 길이
  // UserPwLengthError: 'UserPwLengthError',

  // 확인 비밀번호랑 불일치
  // UserConfirmPwMismatchError: 'UserConfirmPwMismatchError',

  // ----------------------------------------------------------------

  // LOGIN
  // 아이디 존재 하지 않음
  UserUsernameNotExistError: 'UserUsernameNotExistError',

  // 비밀번호 일치하지 않음
  UserPwMismatchError: 'UserPwMismatchError',

  // ----------------------------------------------------------------

  // AUTHMIDDLEWARE
  // !authorization, 로그인 필요 시
  LoginRequiredError: 'LoginRequiredError',

  // 토큰 타입 일치하지 않을 떄
  TokenTypeMismatchError: 'TokenTypeMismatchError',

  // 토큰 사용자가 존재하지 않을 때, 권한이 없을 때
  TokenUserDoesNotExistError: 'TokenUserDoesNotExistError',

  // ----------------------------------------------------------------

  // POST
  PostNotExistError: 'PostNotExistError',
  AllPostsNotExistError: 'AllPostsNotExistError',
};

class CustomError extends Error {
  constructor(type) {
    super(type);
    this.name = 'CustomError';
    this.type = type;
  }
}

class ValidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidError';
  }
}

module.exports = { CustomError, ErrorTypes, ValidError };
