import { Issue } from '@/types';
import { IssueModel, PersonaModel } from '@/server/models';

export default defineEventHandler(async (event): Promise<{ issue: Issue }> => {
  authenticate(event.context);

  const _id = getRouterParam(event, 'issue');

  const issue = await IssueModel.findById(_id).populate('personas').exec();

  if (!issue) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Issue dose not exist',
    });
  }

  return { issue };
});
