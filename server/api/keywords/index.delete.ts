import { DeleteResult } from 'mongodb';

import type { ResourceObject } from '@/types';
import { KeywordModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<DeleteResult>> => {
    authenticate(event.context);
    const { ids: idParam } = getQuery<{ ids: string }>(event);
    const ids = idParam.split(',');

    const deleteResult = await KeywordModel.deleteMany({ _id: { $in: ids } });

    if (deleteResult.deletedCount === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No keywords found to delete',
      });
    }

    return {
      message: 'keywords successfully deleted',
      data: deleteResult,
    };
  }
);
