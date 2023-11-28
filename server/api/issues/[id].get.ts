import { BaseIssue, ResourceObject } from '@/types';
import { IssueModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<BaseIssue>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const issue = await IssueModel.findById(id);
    // .populate([
    //   { path: 'personas', populate: 'creator' },
    //   {
    //     path: 'cases',
    //     model: 'Case',
    //     populate: [
    //       'creator',
    //       {
    //         path: 'keywords',
    //         options: { sort: { updatedAt: -1 } },
    //         populate: [
    //           'creator',
    //           {
    //             path: 'votes',
    //             options: { sort: { updatedAt: -1 } },
    //             populate: ['creator', 'keyword'],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     path: 'poemsTemplates',
    //     model: 'PoemsTemplates',
    //     populate: [
    //       'creator',
    //       {
    //         path: 'persona',
    //         populate: 'creator',
    //       },
    //     ],
    //   },
    //   { path: 'stories', populate: 'creator' },
    //   { path: 'illustrations', populate: 'creator' },
    // ]);

    if (!issue) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue dose not exist',
      });
    }

    return { data: issue };
  }
);
