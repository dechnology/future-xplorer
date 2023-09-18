import { Workshop, ResourceObject } from '@/types';
import { WorkshopModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Workshop>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const workshop = await WorkshopModel.findById(id);

    if (!workshop) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workshop does not exist',
      });
    }
    return { data: workshop };
  }
);
