import { FilterQuery } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Keyword, KeywordQuery, ResourceObject } from '@/types';
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
    } else {
      filter.case = caseId;
    }

    if (searchQuery) {
      filter = {
        ...filter,
        $or: [
          { body: { $regex: searchQuery, $options: 'i' } },
          { category: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    // filter votes
    if (voterId) {
      const votes = await VoteModel.find({ creator: voterId }).distinct(
        'keyword'
      );

      if (voted === 'true') {
        filter = { ...filter, _id: { $in: votes } };
      } else {
        filter = { ...filter, _id: { $nin: votes } };
      }
    }

    let el: Keyword[];

    if (voterId && voted === 'true') {
      el = await KeywordModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'vote',
            let: { keywordId: '$_id' }, // Define the variable to be used in the pipeline
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$keyword', '$$keywordId'] },
                      { $eq: ['$creator', new ObjectId(voterId)] },
                    ],
                  },
                },
              },
              { $limit: 1 }, // Limit to 1 vote
              { $project: { _id: 1, createdAt: 1, keyword: 1, creator: 1 } }, // Project only necessary fields
            ],
            as: 'vote', // output array field
          },
        },
        { $unwind: '$vote' }, // Deconstructs the votes array
        {
          $lookup: {
            from: 'vote',
            localField: '_id',
            foreignField: 'keyword',
            pipeline: [
              {
                $lookup: {
                  from: 'user',
                  localField: 'creator',
                  foreignField: '_id',
                  as: 'creator',
                },
              },
              { $unwind: '$creator' },
            ],
            as: 'votes',
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator',
          },
        },
        { $unwind: '$creator' },
        { $sort: { 'votes.createdAt': -1 } }, // Sorts by the createdAt field of votes
      ]);
    } else {
      el = await KeywordModel.find(filter)
        .sort({ updatedAt: -1 })
        .populate(['creator', { path: 'votes', populate: 'creator' }]);
    }

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Keywords do not exist',
      });
    }

    return { data: el };
  }
);
