import type { NewIssue, Issue } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(async (event): Promise<{ issue: Issue }> => {
  authenticate(event.context);
  const issueId = getRouterParam(event, 'issue');
  const newIssue: NewIssue = await readBody(event);
  const issue = await IssueModel.findByIdAndUpdate(issueId, newIssue, {
    new: true,
  });
  if (!issue) {
    throw Error('Issue update failed');
  }
  return { issue };
});
