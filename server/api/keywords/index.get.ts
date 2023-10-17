import { FilterQuery } from 'mongoose';
import { Keyword, ResourceObject } from '@/types';
import { CaseModel, KeywordModel } from '@/server/models';

interface KeywordQuery {
  issueId: string;
  userIds?: string[];
  searchQuery?: string;
}

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword[]>> => {
    authenticate(event.context);

    const { issueId, userIds, searchQuery } = getQuery<KeywordQuery>(event);

    if (!issueId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue ID is required',
      });
    }

    // Find all cases for the given issue
    const cases = await CaseModel.find({ issue: issueId }).select('_id');
    const caseIds = cases.map((c) => c._id);

    const filter: FilterQuery<Keyword> = { case: { $in: caseIds } };
    if (userIds) {
      filter.creator = { $in: userIds };
    }
    if (searchQuery) {
      filter.$text = { $search: searchQuery };
    }

    const el = await KeywordModel.find(filter).populate([
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
