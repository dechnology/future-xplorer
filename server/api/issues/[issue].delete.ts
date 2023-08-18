import type { BaseIssue, ResourceObject } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<BaseIssue>> => {
    authenticate(event.context);
    const issueId = getRouterParam(event, 'issue');
    const issue = await IssueModel.findByIdAndDelete(issueId);

    if (!issue) {
      throw createError({
        statusCode: 400,
        statusMessage: 'issue does not exist',
      });
    }
    return {
      message: 'issue successfully deleted',
      data: issue,
    };
  }
);
