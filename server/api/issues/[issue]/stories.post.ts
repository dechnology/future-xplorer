import { StoryModel } from '@/server/models';
import { ResourceObject, NewStory, Story } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Story>> => {
    const { id: creator } = authenticate(event.context);
    const issue = getRouterParam(event, 'issue');

    const newStory: NewStory = await readBody(event);
    const story = await StoryModel.create({
      creator,
      issue,
      ...newStory,
    });

    if (!story) {
      throw new Error('Story creation failed');
    }
    return { data: story };
  }
);
