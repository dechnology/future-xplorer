import { BaseIssue } from '@/types/issue';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<{ issues: BaseIssue[] }> => {
    authenticate(event.context);
    const workshop = getRouterParam(event, 'workshop');
    const issues = await IssueModel.find({ workshop }).populate('creator');

    if (!issues) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issues do not exist',
      });
    }
    return { issues };
  }
);
