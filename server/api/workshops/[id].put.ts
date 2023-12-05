import { WorkshopModel } from '@/server/models';
import {
  ResourceObject,
  NewWorkshop,
  Workshop,
  WorkshopElements,
} from '@/types';

// Define a type where each key of WorkshopElements maps to a string
type RequiredValues = {
  [K in keyof WorkshopElements]: string;
};

const requiredValues: RequiredValues = {
  objects: '技術',
  environments: '場景體驗',
  messages: '洞見與價值',
  services: '使用者體驗',
} as const;

export default defineEventHandler(
  async (event): Promise<ResourceObject<Workshop>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const newWorkshop: NewWorkshop = await readBody(event);

    for (const [field, value] of Object.entries(requiredValues) as [
      keyof NewWorkshop,
      string,
    ][]) {
      const fieldValue = newWorkshop[field];

      // Check if fieldValue is an array and includes the required value
      if (!Array.isArray(fieldValue) || !fieldValue.includes(value)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request: Missing Required Value',
        });
      }
    }

    const workshop = await WorkshopModel.findByIdAndUpdate(id, newWorkshop, {
      new: true,
    });

    if (!workshop) {
      throw new Error('Workshop creation failed');
    }
    return { data: workshop };
  }
);
