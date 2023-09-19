import type { Keyword, ResourceObject } from '@/types';
import { KeywordModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const keyword = await KeywordModel.findByIdAndDelete(id);

    if (!keyword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'issue does not exist',
      });
    }

    return {
      message: 'keyword successfully deleted',
      data: keyword,
    };
  }
);
