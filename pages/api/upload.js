const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const nextConnect = require('next-connect');
const { promisify } = require('util');

// Set up memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });
const runMiddleware = promisify(upload.single('file'));

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const handler = nextConnect({
  onError(err, req, res) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  },
});

handler.use(async (req, res, next) => {
  await runMiddleware(req, res);
  next();
});

handler.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;
  const uniqueKey = `uploads/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: uniqueKey,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  });

  try {
    await s3Client.send(command);
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;
    res.status(200).json({ url });
  } catch (err) {
    console.error('S3 Upload Error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = handler;

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
