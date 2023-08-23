import { PutObjectCommand } from '@aws-sdk/client-s3';
import { ResourceObject } from '@/types';

const { s3Domain } = useRuntimeConfig();

export default defineEventHandler(
  async (event): Promise<ResourceObject<string>> => {
    const { s3 } = useNitroApp();
    const { url, key }: { url: string; key: string } = await readBody(event);

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
      return {
        data: `https://${s3Domain}/${key}`,
        message: 'Image uploaded successfully to S3 via URL.',
      };
    } catch (e) {
      console.error('Error uploading to S3', e);
      throw new Error('Failed to upload image to S3.');
    }
  }
);
