import { KeywordModel } from '@/server/models';
import { ResourceObject, NewKeyword, Keyword } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword[]>> => {
    const { id: creator } = authenticate(event.context);
    const id = getRouterParam(event, 'id');

    const newKeywords = (await readBody<{ keywords: NewKeyword[] }>(event))
      .keywords;

    const keywordDocuments = await KeywordModel.insertMany(
      newKeywords.map((newKeyword) => ({
        creator,
        case: id,
        ...newKeyword,
      }))
    );

    if (!keywordDocuments) {
      throw new Error('Keywords creation failed');
    }

    const keywords: Keyword[] = keywordDocuments.map((doc) => doc.toObject());

    return { data: keywords };
  }
);
