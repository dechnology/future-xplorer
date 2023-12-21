import type { ResourceObject } from '@/types';
import { VoteModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<null>> => {
    const { keyword } = getQuery(event);

    if (!keyword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'keyword not provided',
      });
    }

    const { id: creator } = authenticate(event.context);
    const vote = await VoteModel.deleteOne({ creator, keyword });

    if (!vote.acknowledged) {
      throw createError({
        statusCode: 400,
        statusMessage: 'vote does not exist',
      });
    }

    return {
      message: 'vote successfully deleted',
      data: null,
    };
  }
);
