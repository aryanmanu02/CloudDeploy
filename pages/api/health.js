export default function handler(req, res) {
  // Simple health check endpoint
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      mongodb: process.env.MONGODB_URI ? 'configured' : 'missing',
      aws_region: process.env.AWS_REGION ? 'configured' : 'missing',
      aws_s3: process.env.AWS_S3_BUCKET ? 'configured' : 'missing'
    }
  });
}
