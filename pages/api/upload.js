import nextConnect from 'next-connect';
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

// ✅ Use IAM Role — no credentials object needed
const s3 = new aws.S3({
  region: process.env.AWS_REGION, // make sure this is set in .env.production
});

// ✅ Configure multer to upload to S3
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

// ✅ Create API route handler with next-connect
const handler = nextConnect({
  onError(err, req, res) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  },
});

// ✅ Apply multer middleware
handler.use(upload.single('file'));

// ✅ Handle POST requests
handler.post((req, res) => {
  res.status(200).json({ url: req.file.location });
});

// ✅ Required for file uploads in Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
