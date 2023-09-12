import type { NewPoemsTemplate, PoemsTemplate, ResourceObject } from '@/types';
import { PoemsTemplateModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<PoemsTemplate>> => {
    authenticate(event.context);
    const poemsTemplateId = getRouterParam(event, 'poemsTemplate');
    const newPoemsTemplate: NewPoemsTemplate = await readBody(event);
    const poemsTemplate = await PoemsTemplateModel.findByIdAndUpdate(
      poemsTemplateId,
      newPoemsTemplate,
      {
        new: true,
      }
    );

    if (!poemsTemplate) {
      throw Error('PoemsTemplate update failed');
    }
    return { data: poemsTemplate };
  }
);
