const nextConnect = require('next-connect');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

// ✅ Create S3 client using IAM Role
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    key: (req, file, cb) => {
      const fileName = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

const handler = nextConnect({
  onError(err, req, res) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  },
}).use(upload.single('file'));

handler.post((req, res) => {
  res.status(200).json({ url: req.file.location });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
