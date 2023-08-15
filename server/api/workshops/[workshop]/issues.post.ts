import { IssueModel } from '@/server/models';
import { NewIssue, BaseIssue } from '@/types/issue';

export default defineEventHandler(
  async (event): Promise<{ issue: BaseIssue }> => {
    const { id: creator } = authenticate(event.context);
    const workshop = getRouterParam(event, 'workshop');

    const newIssue: NewIssue = await readBody(event);
    const issue = await IssueModel.create({
      creator,
      workshop,
      ...newIssue,
    });
    if (!issue) {
      throw Error('Issue creation failed');
    }
    return { issue };
  }
);
