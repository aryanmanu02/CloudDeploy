const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  // credentials not needed if using EC2 IAM Role
});

module.exports = s3Client;
