import { IssueModel } from '@/server/models';
import { ResourceObject, NewIssue, BaseIssue } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<BaseIssue>> => {
    const { id: creator } = authenticate(event.context);
    const workshop = getRouterParam(event, 'id');

    const newIssue: NewIssue = await readBody(event);
    const issue = await IssueModel.create({
      creator,
      workshop,
      ...newIssue,
    });
    if (!issue) {
      throw new Error('Issue creation failed');
    }
    return { data: issue };
  }
);
