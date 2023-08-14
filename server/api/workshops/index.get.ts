import { H3Error } from 'h3';
import { Workshop } from '@/types/workshop';
import { authenticate } from '@/server/utils/authenticate';
import WorkshopModel from '@/server/models/workshop';

export default defineEventHandler(
  async (event): Promise<{ workshops: Workshop[] }> => {
    try {
      authenticate(event.context);
      const workshops = await WorkshopModel.find();
      if (!workshops) {
        throw createError({
          statusCode: 501,
          statusMessage: 'Workshops not found',
        });
      }
      return { workshops };
    } catch (e) {
      if (e instanceof H3Error) {
        throw e;
      } else {
        throw createError({
          statusCode: 501,
          statusMessage: `Uncaught error: ${e}`,
        });
      }
    }
  }
);
