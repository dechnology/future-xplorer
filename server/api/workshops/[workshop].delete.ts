import { WorkshopModel } from '@/server/models';
import { Workshop } from '@/types/workshop';

export default defineEventHandler(
  async (event): Promise<{ message: string; workshop: Workshop | null }> => {
    authenticate(event.context);
    const workshopId = getRouterParam(event, 'workshop');
    const deletedWorkshop = await WorkshopModel.findByIdAndDelete(workshopId);
    return {
      message: 'workshop successfully deleted',
      workshop: deletedWorkshop,
    };
  }
);
