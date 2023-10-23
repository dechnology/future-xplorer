import { FilterQuery } from 'mongoose';
import { Keyword, KeywordQuery, ResourceObject, Vote } from '@/types';
import { CaseModel, KeywordModel, VoteModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword[]>> => {
    authenticate(event.context);

    const { issueId, caseId, userId, category, searchQuery, voterId, voted } =
      getQuery<Record<keyof KeywordQuery, string>>(event);

    console.log(getQuery<KeywordQuery>(event));

    if (!(issueId || caseId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue or case id must be provided',
      });
    }

    let filter: FilterQuery<Keyword> = {};

    if (userId) {
      filter.creator = userId;
    }

    if (category === 'null') {
      filter.category = { $type: 10 };
    } else if (category) {
      filter.category = category;
    }

    if (issueId && !caseId) {
      // Find all cases for the given issue
      const cases = await CaseModel.find({ issue: issueId }).select('_id');
      const caseIds = cases.map((c) => c._id);
      filter.case = { $in: caseIds };
      if (searchQuery) {
        filter.$text = { $search: searchQuery };
      }
    } else {
      filter.case = caseId;
    }

    // filter votes
    if (voterId) {
      const votes: Vote[] = await VoteModel.find({ creator: voterId }).distinct(
        'keyword'
      );
      if (voted === 'true') {
        filter = { ...filter, _id: { $in: votes } };
      } else {
        filter = { ...filter, _id: { $nin: votes } };
      }
    }

    console.log(filter);
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
