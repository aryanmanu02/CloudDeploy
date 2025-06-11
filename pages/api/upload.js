import nextConnect from 'next-connect';
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => cb(null, `products/${Date.now()}-${file.originalname}`)
  })
});

const handler = nextConnect({
  onError(err, req, res) {
    res.status(500).json({ error: err.message });
  }
}).use(upload.single('file'));

handler.post((req, res) => {
  res.status(200).json({ url: req.file.location });
});

export const config = { api: { bodyParser: false } };
export default handler;
