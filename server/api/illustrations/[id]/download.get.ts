import { IllustrationModel } from '@/server/models';

export default defineEventHandler(async (event): Promise<Blob> => {
  authenticate(event.context);
  const id = getRouterParam(event, 'id');
  const illustration = await IllustrationModel.findById(id);

  if (!illustration) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Illustration does not exist',
    });
  }

  console.log('illustration', illustration);

  const blobImage = await $fetch<Blob>(illustration.image);

  console.log('blobImage', blobImage);

  return blobImage;
});
