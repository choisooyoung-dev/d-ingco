const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); // [이아영] 127.0.0.1 이슈 해결 패키지

const authRouter = require('./routes/users/auth.routes.js');
const signupRouter = require('./routes/users/signup.routes.js');
const postRouter = require('./routes/posts/post.routes.js');
const infoRouter = require('./routes/users/info.routes.js');

app.set('port', process.env.PORT || 3000);

app.use(cookieParser());
app.use(cors({ credentials: true, origin: ['http://localhost:5501'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use('/api', express.static(__dirname + '/views')); // [이아영] views/ 파일들 조회

app.use('/api/users', authRouter);
app.use('/api/users', signupRouter);
app.use('/api/users', infoRouter);
app.use('/api/posts', postRouter);


// 서버 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});