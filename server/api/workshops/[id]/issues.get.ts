import { BaseIssue, ResourceObject } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<BaseIssue[]>> => {
    authenticate(event.context);
    const workshop = getRouterParam(event, 'id');
    const issues = await IssueModel.find({ workshop }).populate('creator');

    if (!issues) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issues do not exist',
      });
    }
    return { data: issues };
  }
);
