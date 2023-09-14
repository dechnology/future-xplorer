import type { Story, ResourceObject } from '@/types';
import { StoryModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Story>> => {
    authenticate(event.context);
    const storyId = getRouterParam(event, 'story');
    const story = await StoryModel.findByIdAndDelete(storyId);

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
