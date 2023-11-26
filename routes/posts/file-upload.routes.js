const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');

AWS.config.update({
  accessKeyId: 'AKIAXTH4Q2QWPREPPWWN',
  secretAccessKey: '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',
  region: 'ap-northeast-2', // 예: 'us-west-1'
});

const fs = require('fs');

const s3 = new AWS.S3();
// Multer 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'YOUR_S3_BUCKET_NAME',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + path.basename(file.originalname));
    }
  })
});

// EJS 파일 렌더링
// app.set('view engine', 'ejs');

router.get('/upload-page', (req, res) => {
  res.render('upload'); // upload.ejs 렌더링
});

// 파일 업로드 처리
router.post('/', upload.single('fileUpload'), (req, res) => {
  // 파일 업로드 후의 추가 로직을 구현할 수 있습니다.
  res.send('File uploaded successfully!');
});

module.exports = router;
