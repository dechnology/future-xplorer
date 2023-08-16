import { Issue } from '@/types/issue';
import { IssueModel } from '@/server/models';

export default defineEventHandler(async (event): Promise<{ issue: Issue }> => {
  authenticate(event.context);

  const _id = getRouterParam(event, 'issue');
  const workshop = getRouterParam(event, 'workshop');

  console.log(_id, workshop);

  const issue = await IssueModel.findOne({
    _id,
    workshop,
  }).populate('personas');

  if (!issue) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Issue dose not exist',
    });
  }

  return { issue };
});
