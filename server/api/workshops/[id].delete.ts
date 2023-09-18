import { WorkshopModel } from '@/server/models';
import { Workshop, ResourceObject } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Workshop>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'workshop');
    const workshop = await WorkshopModel.findByIdAndDelete(id);

    if (!workshop) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workshop does not exist',
      });
    }
    return {
      message: 'workshop successfully deleted',
      data: workshop,
    };
  }
);
