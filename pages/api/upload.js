import nextConnect from 'next-connect';
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

// Configure AWS
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer storage to S3
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

// Set up handler
const handler = nextConnect({
  onError(err, req, res) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  },
}).use(upload.single('file'));

// Handle POST upload
handler.post((req, res) => {
  return res.status(200).json({ url: req.file.location });
});

// Disable default bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
