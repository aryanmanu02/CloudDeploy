// pages/api/upload.js
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../../utils/s3';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const handler = nextConnect({
  onError: (err, req, res) => {
    console.error('Upload API error:', err);
    res.status(500).json({ 
      error: 'Server Error',
      message: err.message || 'File upload failed' 
    });
  }
});

// Middleware chain setup
handler
  .use(upload.single('file'))
  .post(async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const { buffer, originalname, mimetype } = req.file;
      const fileKey = `uploads/${Date.now()}-${originalname.replace(/\s+/g, '-')}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read'
      });

      await s3Client.send(command);
      
      const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      return res.status(200).json({ url: fileUrl });

    } catch (error) {
      console.error('S3 Upload Error:', error);
      return res.status(500).json({
        error: 'Upload Failed',
        message: error.message || 'Check server logs'
      });
    }
  });

export const config = {
  api: {
    bodyParser: false // Disable default body parsing
  }
};

export default handler;
