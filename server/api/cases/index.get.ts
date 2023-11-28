import { FilterQuery } from 'mongoose';
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

    const filter: FilterQuery<Case> = { issue: issueId };
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      filter.$or = [
        { title: searchRegex },
        { background: searchRegex },
        { method: searchRegex },
        { goal: searchRegex },
        { challenge: searchRegex },
        { result: searchRegex },
        { reference: searchRegex },
        { other: searchRegex },
      ];
    }

    const el = await CaseModel.find(filter)
      .sort({ createdAt: -1 })
      .populate([
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
