import { BaseIssue, ResourceObject } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<BaseIssue>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const issue = await IssueModel.findById(id);

    if (!issue) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue dose not exist',
      });
    }

    return { data: issue };
  }
);
