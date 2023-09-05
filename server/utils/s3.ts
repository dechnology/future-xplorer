import { S3Client } from '@aws-sdk/client-s3';

const { s3AccessKeyId, s3SecretAccessKey } = useRuntimeConfig();

export const s3 = new S3Client({
  region: 'us-west-2',
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey,
  },
});
