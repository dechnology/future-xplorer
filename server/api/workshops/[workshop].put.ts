import { WorkshopModel } from '@/server/models';
import { ResourceObject, NewWorkshop, Workshop } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Workshop>> => {
    authenticate(event.context);
    const workshopId = getRouterParam(event, 'workshop');
    const newWorkshop: NewWorkshop = await readBody(event);
    const workshop = await WorkshopModel.findByIdAndUpdate(
      workshopId,
      newWorkshop,
      { new: true }
    );

    if (!workshop) {
      throw Error('Workshop creation failed');
    }
    return { data: workshop };
  }
);
