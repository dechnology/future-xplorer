import { PoemsTemplateModel } from '@/server/models';
import { ResourceObject, NewPoemsTemplate, PoemsTemplate } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<PoemsTemplate>> => {
    const { id: creator } = authenticate(event.context);
    const issue = getRouterParam(event, 'issue');

    const newPoemsTemplate: NewPoemsTemplate & { persona: string } =
      await readBody(event);
    const poemsTemplate = await PoemsTemplateModel.create({
      creator,
      issue,
      ...newPoemsTemplate,
    });

    if (!poemsTemplate) {
      throw Error('PoemsTemplate creation failed');
    }
    return { data: poemsTemplate };
  }
);
