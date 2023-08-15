import { WorkshopModel } from '@/server/models';
import { NewWorkshop, Workshop } from '@/types/workshop';

export default defineEventHandler(
  async (event): Promise<{ workshop: Workshop }> => {
    const { id: creator } = authenticate(event.context);
    const newWorkshop: NewWorkshop = await readBody(event);
    const workshop = await WorkshopModel.create({
      creator,
      ...newWorkshop,
    });
    if (!workshop) {
      throw Error('Workshop creation failed');
    }
    return { workshop };
  }
);
