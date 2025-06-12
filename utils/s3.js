import { S3Client } from '@aws-sdk/client-s3';

const config = {
  region: process.env.AWS_REGION
};

if (process.env.AWS_ACCESS_KEY_ID) {
  config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
}

export default new S3Client(config);
