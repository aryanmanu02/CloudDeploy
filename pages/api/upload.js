import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { promisify } from 'util';

const upload = multer({ storage: multer.memoryStorage() });
const runMiddleware = promisify(upload.single('file'));

// Replace with your S3 bucket name and region
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'your-region',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key-id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-access-key'
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    await runMiddleware(req, res);

    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const key = `uploads/${uniqueSuffix}-${req.file.originalname}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME || 'your-bucket-name',
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    await s3Client.send(new PutObjectCommand(params));

    // Replace with your S3 bucket URL
    const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION || 'your-region'}.amazonaws.com/${key}`;

    res.status(200).json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
