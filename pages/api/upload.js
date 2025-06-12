// pages/api/upload.js
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import nextConnect from 'next-connect';

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect();

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const fileKey = `uploads/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    });

    await s3.send(command);

    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    res.status(200).json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', message: error.message });
  }
});

export const config = {
  api: { bodyParser: false }
};

export default handler;
