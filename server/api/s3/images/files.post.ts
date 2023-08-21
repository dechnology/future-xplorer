import { PutObjectCommand } from '@aws-sdk/client-s3';
import { ResourceObject } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<null>> => {
    const s3 = useNitroApp().s3;
    const rawFormData = await readMultipartFormData(event);
    const formData: { key?: string; image?: Buffer; contentType?: string } = {};

    if (!rawFormData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formdata not provided',
      });
    }

    for (const datum of rawFormData) {
      if (datum.name === 'key') {
        formData['key'] = datum.data.toString('utf-8');
      } else if (datum.name === 'image') {
        formData['image'] = datum.data;
        formData['contentType'] = datum.type;
      }
    }
    console.log(formData);

    if (!formData.key) {
      throw createError({
        statusCode: 400,
        statusMessage: 'key not provided',
      });
    }

    if (!(formData.image && formData.contentType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'image not provided',
      });
    }

    try {
      const { key: Key, image: Body, contentType: ContentType } = formData;

      const command = new PutObjectCommand({
        Bucket: 'dechnology',
        Key,
        Body,
        ContentType,
      });
      const result = await s3.send(command);
      console.log('Upload success: ', result);
      return {
        data: null,
        message: 'image uploaded successfully to S3 via formdata.',
      };
    } catch (e) {
      console.error('Error uploading to S3: ', e);
      throw new Error('Failed to upload image to S3.');
    }
  }
);
