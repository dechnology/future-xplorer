import { BaseIssue, Issue } from '@/types/issue';
import IssueModel from '@/server/models/issue';

export default defineEventHandler(
  async (event): Promise<{ issues: BaseIssue[] }> => {
    authenticate(event.context);
    const issues = await IssueModel.find({
      workshop: event.context.params?.workshopId,
    });
    if (!issues) {
      throw createError({
        statusCode: 501,
        statusMessage: 'Issues not found',
      });
    }
    return { issues };
  }
);
