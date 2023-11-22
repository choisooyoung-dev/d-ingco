const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./routes'); // [이아영] routes 폴더 내의 index.js에서 API들 호출할 예정
const cors = require('cors'); // [이아영] 127.0.0.1 이슈 해결 패키지

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/views', express.static(__dirname + '/views')); // [이아영] views/ 파일들 조회
app.use("/views", routes);

// 서버 실행
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
