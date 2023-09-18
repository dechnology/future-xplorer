import { PoemsTemplateModel } from '@/server/models';
import { ResourceObject, NewPoemsTemplate, PoemsTemplate } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<PoemsTemplate>> => {
    const { id: creator } = authenticate(event.context);
    const issue = getRouterParam(event, 'id');

    const newPoemsTemplate: NewPoemsTemplate & { persona: string } =
      await readBody(event);
    const poemsTemplate = await PoemsTemplateModel.create({
      creator,
      issue,
      ...newPoemsTemplate,
    });

    if (!poemsTemplate) {
      throw new Error('PoemsTemplate creation failed');
    }
    return { data: poemsTemplate };
  }
);
