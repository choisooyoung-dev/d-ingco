const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
<<<<<<< HEAD
const loginRouter = require('./routes/users/login.routes.js'); // [이아영] routes 폴더 내의 index.js에서 API들 호출할 예정
const signupRouter = require('./routes/users/signup.routes.js');
=======
>>>>>>> abae33d69fdccf0c3f358f0f7f123438c5010d60
const cors = require('cors'); // [이아영] 127.0.0.1 이슈 해결 패키지

const loginRouter = require('./routes/users/login.routes.js');
const signupRouter = require('./routes/users/signup.routes.js');
const editRouter = require('./routes/posts/post.routes.js'); // [


app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

<<<<<<< HEAD
//app.use('/api', express.static(__dirname + '/views')); // [이아영] views/ 파일들 조회
app.use('/api', signupRouter);
app.use('/api', loginRouter);
=======
// app.use('/api', express.static(__dirname + '/views')); // [이아영] views/ 파일들 조회

app.use("/api/users", loginRouter);
app.use("/api/users", signupRouter);
app.use("/api/posts", editRouter);
>>>>>>> abae33d69fdccf0c3f358f0f7f123438c5010d60

// 서버 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
