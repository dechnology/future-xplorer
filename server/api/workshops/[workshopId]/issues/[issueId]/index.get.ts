import { H3Error } from 'h3';
import { BaseIssue, Issue } from '@/types/issue';
import { Workshop } from '@/types/workshop';
import WorkshopModel from '@/server/models/workshop';
import IssueModel from '@/server/models/issue';

export default defineEventHandler(async (event): Promise<{ issue: Issue }> => {
  authenticate(event.context);

  if (!event.context.params) {
    throw new Error('no params');
  }

  const { workshopId, issueId } = event.context.params;
  const issue = await IssueModel.findOne({
    _id: issueId,
    workshop: workshopId,
  });

  if (!issue) {
    throw createError({
      statusCode: 501,
      statusMessage: 'Issues not found',
    });
  }
  return { issue };
});
