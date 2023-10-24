import { FilterQuery } from 'mongoose';
import { Story, ResourceObject } from '@/types';
import { StoryModel } from '@/server/models';

interface StoryQuery {
  issueId: string;
  searchQuery?: string;
}

export default defineEventHandler(
  async (event): Promise<ResourceObject<Omit<Story, 'issue'>[]>> => {
    authenticate(event.context);

    const { issueId, searchQuery } = getQuery<StoryQuery>(event);

    if (!issueId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue ID is required',
      });
    }

    const filter: FilterQuery<Story> = { issue: issueId };
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }

    const el = await StoryModel.find(filter).populate('creator');

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Stories do not exist',
      });
    }

    return { data: el };
  }
);
