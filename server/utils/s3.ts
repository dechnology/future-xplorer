import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const { s3AccessKeyId, s3SecretAccessKey, s3Domain } = useRuntimeConfig();

console.log('s3AccessKeyId: ', s3AccessKeyId);
console.log('s3SecretAccessKey: ', s3SecretAccessKey);
console.log('s3Domain: ', s3Domain);

export const s3 = new S3Client({
  region: 'us-west-2',
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey,
  },
});

export const uploadImageToS3WithUrl = async (
  url: string,
  key: string
): Promise<string> => {
  try {
    console.log('downloading from: ', url);
    const data = await $fetch<Blob>(url);
    console.log('downloaded content: ', data);

    const command = new PutObjectCommand({
      Bucket: 'dechnology',
      Key: key,
      Body: Buffer.from(await data.arrayBuffer()),
      ContentType: `image/${key.split('.').pop()}`,
    });
    const result = await s3.send(command);
    console.log('Upload success', result);
    return `https://${s3Domain}/${key}`;
  } catch (e) {
    console.error('Error uploading to S3', e);
    throw new Error('Failed to upload image to S3.');
  }
};
