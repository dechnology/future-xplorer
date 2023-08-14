import { H3Error } from 'h3';
import WorkshopModel from '@/server/models/workshop';
import { NewWorkshop, Workshop } from '@/types/workshop';
import { Schema } from 'mongoose';

export default defineEventHandler(
  async (event): Promise<{ workshop: Workshop }> => {
    const { id } = authenticate(event.context);
    const newWorkshop: NewWorkshop = await readBody(event);
    const workshop = await WorkshopModel.create({
      creator: id,
      ...newWorkshop,
    });
    if (!workshop) {
      throw Error('Workshop creation failed');
    }
    return { workshop };
  }
);
