import { v4 as uuidv4 } from 'uuid';
import { IllustrationModel } from '~/server/models';
import { uploadImageToS3WithUrl } from '~/server/utils/s3';
import { Illustration, ResourceObject } from '~/types';

const baseFilepath = 'tdri/imgs/personas/originals';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Illustration | null>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const illustration = await IllustrationModel.findById(id);

    if (!illustration) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Illustration does not exist',
      });
    }

    if (illustration.image) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Illustration has already been processed',
      });
    }

    try {
      // generating
      illustration.status = 'generating';
      await illustration.save();

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: illustration.prompt,
        n: 1,
        size: '1024x1024',
      });

      if (!response.data[0].url) {
        throw new Error(`OpenAI error: ${response}`);
      }

      // uploading
      illustration.status = 'uploading';
      await illustration.save();

      const responseUrl = response.data[0].url;
      const ext = responseUrl.split('?')[0].split('.').pop();
      const filepath = `${baseFilepath}/${uuidv4()}.${ext}`;
      const imageUrl = await uploadImageToS3WithUrl(responseUrl, filepath);

      // finalized
      illustration.image = imageUrl;
      illustration.status = 'done';
      await illustration.save();
      return { data: illustration };
    } catch (error) {
      console.error(error);
      await illustration.deleteOne();
      throw error;
    }
  }
);
