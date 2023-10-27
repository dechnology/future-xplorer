import { HistoryCase, ResourceObject } from '@/types';
import { HistoryCaseModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<HistoryCase[]>> => {
    authenticate(event.context);

    const el = await HistoryCaseModel.find();

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'History cases do not exist',
      });
    }

    return { data: el };
  }
);
