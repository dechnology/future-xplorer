import type { PoemsTemplate, ResourceObject } from '@/types';
import { PoemsTemplateModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<PoemsTemplate>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const poemsTemplate = await PoemsTemplateModel.findByIdAndDelete(id);

    if (!poemsTemplate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'issue does not exist',
      });
    }

    return {
      message: 'poemsTemplate successfully deleted',
      data: poemsTemplate,
    };
  }
);
