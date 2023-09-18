import type { NewIssue, ResourceObject, BaseIssue } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<BaseIssue>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const newIssue: NewIssue = await readBody(event);
    const issue = await IssueModel.findByIdAndUpdate(id, newIssue, {
      new: true,
    });

    if (!issue) {
      throw new Error('Issue update failed');
    }
    return { data: issue };
  }
);
