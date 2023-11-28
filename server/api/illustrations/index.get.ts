import { FilterQuery } from 'mongoose';
import { Illustration, ResourceObject } from '@/types';
import { IllustrationModel } from '@/server/models';

interface IllustrationQuery {
  issueId: string;
  searchQuery?: string;
}

export default defineEventHandler(
  async (event): Promise<ResourceObject<Omit<Illustration, 'issue'>[]>> => {
    authenticate(event.context);

    const { issueId, searchQuery } = getQuery<IllustrationQuery>(event);

    if (!issueId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue ID is required',
      });
    }

    const filter: FilterQuery<Illustration> = { issue: issueId };
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      filter.$or = [
        { prompt: searchRegex },
        { story: searchRegex },
        { image: searchRegex },
      ];
    }

    const el = await IllustrationModel.find(filter)
      .sort({ createdAt: -1 })
      .populate('creator');

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Illustrations do not exist',
      });
    }

    return { data: el };
  }
);
