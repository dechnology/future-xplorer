import { BaseIssue, ResourceObject } from '@/types';
import { IssueModel } from '@/server/models';

interface IssueQuery {
  workshopId: string;
  searchQuery?: string;
}

export default defineEventHandler(
  async (event): Promise<ResourceObject<BaseIssue[]>> => {
    authenticate(event.context);

    const { workshopId: workshop, searchQuery } = getQuery<IssueQuery>(event);

    if (!workshop) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workshop ID is required',
      });
    }

    const searchRegex = new RegExp(searchQuery || '', 'i');
    const el = await IssueModel.find({
      workshop,
      $or: [{ title: searchRegex }, { description: searchRegex }],
    })
      .sort({ updatedAt: -1 })
      .populate('creator');

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issues do not exist',
      });
    }

    return { data: el };
  }
);
