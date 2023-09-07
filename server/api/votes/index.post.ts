import { VoteModel } from '@/server/models';
import { ResourceObject, NewWorkshop, Workshop, Vote, NewVote } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Vote>> => {
    const { keyword } = getQuery(event);

    console.log(keyword);

    if (!keyword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'keyword not provided',
      });
    }

    const { id: creator } = authenticate(event.context);
    const vote = await VoteModel.create({
      creator,
      keyword: keyword.toString(),
    });
    if (!vote) {
      throw Error('Vote creation failed');
    }
    return { data: vote };
  }
);
