import type { NewStory, Story, ResourceObject } from '@/types';
import { StoryModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Story>> => {
    authenticate(event.context);
    const storyId = getRouterParam(event, 'story');
    const newStory: NewStory = await readBody(event);
    const story = await StoryModel.findByIdAndUpdate(storyId, newStory, {
      new: true,
    });

    if (!story) {
      throw new Error('Story update failed');
    }
    return { data: story };
  }
);
