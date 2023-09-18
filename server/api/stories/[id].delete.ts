import type { Story, ResourceObject } from '@/types';
import { StoryModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Story>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const story = await StoryModel.findByIdAndDelete(id);

    if (!story) {
      throw createError({
        statusCode: 400,
        statusMessage: 'issue does not exist',
      });
    }

    return {
      message: 'story successfully deleted',
      data: story,
    };
  }
);
