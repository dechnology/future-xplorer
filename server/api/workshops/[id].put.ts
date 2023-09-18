import { WorkshopModel } from '@/server/models';
import { ResourceObject, NewWorkshop, Workshop } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Workshop>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const newWorkshop: NewWorkshop = await readBody(event);
    const workshop = await WorkshopModel.findByIdAndUpdate(id, newWorkshop, {
      new: true,
    });

    if (!workshop) {
      throw new Error('Workshop creation failed');
    }
    return { data: workshop };
  }
);
