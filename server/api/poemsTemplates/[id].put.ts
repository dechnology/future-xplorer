import type { NewPoemsTemplate, PoemsTemplate, ResourceObject } from '@/types';
import { PoemsTemplateModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<PoemsTemplate>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const newPoemsTemplate: NewPoemsTemplate = await readBody(event);
    const poemsTemplate = await PoemsTemplateModel.findByIdAndUpdate(
      id,
      newPoemsTemplate,
      {
        new: true,
      }
    );

    if (!poemsTemplate) {
      throw new Error('PoemsTemplate update failed');
    }
    return { data: poemsTemplate };
  }
);
