import { H3Error } from 'h3';
import { Workshop } from '@/types/workshop';
import { WorkshopModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<{ workshops: Workshop[] }> => {
    authenticate(event.context);
    const workshops = await WorkshopModel.find().populate('creator').exec();
    if (!workshops) {
      throw Error('Workshops not found');
    }
    return { workshops };
  }
);
