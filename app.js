const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); // [이아영] 127.0.0.1 이슈 해결 패키지
const path = require('path');
const authRouter = require('./routes/users/auth.routes.js');
const signupRouter = require('./routes/users/signup.routes.js');
const postRouter = require('./routes/posts/post.routes.js');
const infoRouter = require('./routes/users/info.routes.js');
const { ErrorHandler } = require('./middlewares/Error.handler.js');
const commentRouter = require('./routes/comments/comments.routes.js');

app.set('port', process.env.PORT || 5500);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// ejs
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('styles')); // css 적용
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ['http://localhost:5500'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api', express.static(__dirname + '/views')); // [이아영] views/ 파일들 조회

app.use('/api/users', signupRouter);
app.use('/api/users', authRouter);
app.use('/api/users', infoRouter);
app.use('/api/posts', postRouter);
app.use(ErrorHandler);
app.use('/api/posts', commentRouter);

// 서버 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
