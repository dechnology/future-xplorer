import { KeywordModel } from '@/server/models';
import { ResourceObject, Keyword } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Keyword[]>> => {
    const { id: creator } = authenticate(event.context);
    const id = getRouterParam(event, 'id');

    const { keywords: newKeywords } = await readBody<{
      keywords: {
        body: string;
        category?: string;
        type?: 'O' | 'E' | 'M' | 'S';
      }[];
    }>(event);

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
