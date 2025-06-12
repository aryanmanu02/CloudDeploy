// utils/s3.js
import { S3Client } from '@aws-sdk/client-s3';

const s3Config = {
  region: process.env.AWS_REGION
};

// Only add credentials if not using IAM roles
if (process.env.AWS_ACCESS_KEY_ID) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
}

const s3Client = new S3Client(s3Config);

export default s3Client;
