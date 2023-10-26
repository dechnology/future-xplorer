import { ResourceObject, Workshop } from '@/types';
import { WorkshopModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Workshop[]>> => {
    authenticate(event.context);
    const workshops = await WorkshopModel.find()
      .sort({ createdAt: -1 })
      .populate('creator')
      .exec();

    if (!workshops) {
      throw new Error('Workshops not found');
    }
    return { data: workshops };
  }
);
