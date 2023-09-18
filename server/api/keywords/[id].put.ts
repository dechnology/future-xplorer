import type { NewKeyword, ResourceObject, Keyword } from '@/types';
import { KeywordModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const newKeyword: NewKeyword = await readBody(event);

    console.log(newKeyword);
    const keyword = await KeywordModel.findByIdAndUpdate(id, newKeyword, {
      new: true,
    });
    console.log(keyword);

    if (!keyword) {
      throw new Error('Keyword update failed');
    }
    return { data: keyword };
  }
);
