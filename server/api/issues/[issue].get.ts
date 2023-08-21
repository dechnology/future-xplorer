import { Issue, ResourceObject } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Issue>> => {
    authenticate(event.context);
    const _id = getRouterParam(event, 'issue');
    const issue = await IssueModel.findById(_id)
      .populate({ path: 'personas', populate: { path: 'creator' } })
      .populate({ path: 'cases', populate: { path: 'creator' } });

    if (!issue) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue dose not exist',
      });
    }

    return { data: issue };
  }
);