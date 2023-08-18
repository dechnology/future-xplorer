import { ResourceObject, Workshop } from '@/types';
import { WorkshopModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Workshop[]>> => {
    authenticate(event.context);
    const workshops = await WorkshopModel.find().populate('creator').exec();
    if (!workshops) {
      throw Error('Workshops not found');
    }
    return { data: workshops };
  }
);
