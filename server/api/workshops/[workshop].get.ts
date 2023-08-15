import { Workshop } from '@/types/workshop';
import { WorkshopModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<{ workshop: Workshop }> => {
    authenticate(event.context);
    const workshopId = getRouterParam(event, 'workshop');
    const workshop = await WorkshopModel.findById(workshopId);

    if (!workshop) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workshop does not exist',
      });
    }
    return { workshop };
  }
);
