import { Case, ResourceObject } from '@/types';
import { CaseModel } from '@/server/models';

interface CaseQuery {
  issueId: string;
  searchQuery?: string;
}

export default defineEventHandler(
  async (event): Promise<ResourceObject<Case[]>> => {
    authenticate(event.context);

    const { issueId, searchQuery } = getQuery<CaseQuery>(event);

    if (!issueId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue ID is required',
      });
    }

    const el = await CaseModel.find({ issue: issueId }).populate([
      'creator',
      {
        path: 'keywords',
        populate: [
          'creator',
          { path: 'votes', populate: ['creator', 'keyword'] },
        ],
      },
    ]);

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cases do not exist',
      });
    }

    return { data: el };
  }
);
