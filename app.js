const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// 서버 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
