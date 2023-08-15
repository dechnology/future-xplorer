import { WorkshopModel } from '@/server/models';
import { NewWorkshop, Workshop } from '@/types/workshop';

export default defineEventHandler(
  async (event): Promise<{ workshop: Workshop }> => {
    authenticate(event.context);
    const workshopId = getRouterParam(event, 'workshop');
    const newWorkshop: NewWorkshop = await readBody(event);
    const workshop = await WorkshopModel.findByIdAndUpdate(
      workshopId,
      newWorkshop
    );
    if (!workshop) {
      throw Error('Workshop creation failed');
    }
    return { workshop };
  }
);
