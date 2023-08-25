import { KeywordModel } from '@/server/models';
import { ResourceObject, NewKeyword, Keyword } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword>> => {
    const { id: creator } = authenticate(event.context);
    const caseId = getRouterParam(event, 'case');

    const newKeyword: NewKeyword = await readBody(event);

    const Keyword = await KeywordModel.create({
      creator,
      case: caseId,
      ...newKeyword,
    });

    if (!Keyword) {
      throw Error('Keyword creation failed');
    }
    return { data: Keyword };
  }
);
