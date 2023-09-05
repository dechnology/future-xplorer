import type { NewKeyword, ResourceObject, Keyword } from '@/types';
import { KeywordModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword>> => {
    authenticate(event.context);
    const keywordId = getRouterParam(event, 'keyword');
    const newKeyword: NewKeyword = await readBody(event);

    console.log(newKeyword);
    const keyword = await KeywordModel.findByIdAndUpdate(
      keywordId,
      newKeyword,
      {
        new: true,
      }
    );
    console.log(keyword);

    if (!keyword) {
      throw Error('Keyword update failed');
    }
    return { data: keyword };
  }
);
