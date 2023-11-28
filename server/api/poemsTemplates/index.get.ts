import { FilterQuery } from 'mongoose';
import { PoemsTemplate, ResourceObject } from '@/types';
import { PoemsTemplateModel } from '@/server/models';

interface PoemsTemplateQuery {
  issueId: string;
  searchQuery?: string;
}

export default defineEventHandler(
  async (event): Promise<ResourceObject<Omit<PoemsTemplate, 'issue'>[]>> => {
    authenticate(event.context);

    const { issueId, searchQuery } = getQuery<PoemsTemplateQuery>(event);

    if (!issueId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue ID is required',
      });
    }

    const filter: FilterQuery<PoemsTemplate> = { issue: issueId };
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }

    const el = await PoemsTemplateModel.find(filter)
      .sort({ createdAt: -1 })
      .populate([
        'creator',
        {
          path: 'persona',
          populate: 'creator',
        },
      ]);

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Poems Templates do not exist',
      });
    }

    return { data: el };
  }
);
