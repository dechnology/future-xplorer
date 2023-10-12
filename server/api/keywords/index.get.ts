import { Keyword, ResourceObject } from '@/types';
import { KeywordModel } from '@/server/models';

interface KeywordQuery {
  caseId: string;
  searchQuery?: string;
}

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword[]>> => {
    authenticate(event.context);

    const { caseId, searchQuery } = getQuery<KeywordQuery>(event);

    if (!caseId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue ID is required',
      });
    }

    const el = await KeywordModel.find({ case: caseId }).populate([
      'creator',
      { path: 'votes', populate: ['creator', 'keyword'] },
    ]);

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Keywords do not exist',
      });
    }

    return { data: el };
  }
);
