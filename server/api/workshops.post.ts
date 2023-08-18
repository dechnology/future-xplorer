import { WorkshopModel } from '@/server/models';
import { ResourceObject, NewWorkshop, Workshop } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Workshop>> => {
    const { id: creator } = authenticate(event.context);
    const newWorkshop: NewWorkshop = await readBody(event);
    const workshop = await WorkshopModel.create({
      creator,
      ...newWorkshop,
    });
    if (!workshop) {
      throw Error('Workshop creation failed');
    }
    return { data: workshop };
  }
);
