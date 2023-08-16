import type { Issue } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<{ message: string; issue: Issue | null }> => {
    authenticate(event.context);
    const issueId = getRouterParam(event, 'issue');
    const deletedIssue = await IssueModel.findByIdAndDelete(issueId);
    return {
      message: deletedIssue ? 'issue successfully deleted' : 'issue not found',
      issue: deletedIssue,
    };
  }
);
