// pages/api/upload.js
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import s3Client from '../../utils/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const upload = multer({ storage: multer.memoryStorage() });

const handler = nextConnect({
  onError: (err, req, res) => {
    console.error('Upload error:', err);
    res.status(500).json({ 
      error: 'Upload Failed',
      message: err.message 
    });
  }
});

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  try {
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
      ACL: 'public-read'
    });

    await s3Client.send(command);
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;
    res.json({ url });
  } catch (err) {
    console.error('S3 Error:', err);
    res.status(500).json({
      error: 'Upload Failed',
      message: err.message || 'Check server logs'
    });
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
