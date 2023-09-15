import { Issue, ResourceObject } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Issue>> => {
    authenticate(event.context);
    const _id = getRouterParam(event, 'issue');
    const issue = await IssueModel.findById(_id).populate([
      { path: 'personas', populate: 'creator' },
      {
        path: 'cases',
        model: 'Case',
        populate: [
          'creator',
          {
            path: 'keywords',
            populate: [
              'creator',
              { path: 'votes', populate: ['creator', 'keyword'] },
            ],
          },
        ],
      },
      {
        path: 'poemsTemplates',
        model: 'PoemsTemplates',
        populate: [
          'creator',
          {
            path: 'persona',
            populate: 'creator',
          },
        ],
      },
      { path: 'stories', populate: 'creator' },
      { path: 'illustrations', populate: 'creator' },
    ]);

    if (!issue) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue dose not exist',
      });
    }

    return { data: issue };
  }
);
