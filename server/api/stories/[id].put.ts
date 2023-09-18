import type { NewStory, Story, ResourceObject } from '@/types';
import { StoryModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Story>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const newStory: NewStory = await readBody(event);
    const story = await StoryModel.findByIdAndUpdate(id, newStory, {
      new: true,
    });

    if (!story) {
      throw new Error('Story update failed');
    }
    return { data: story };
  }
);
