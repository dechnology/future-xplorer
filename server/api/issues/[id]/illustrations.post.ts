import { IllustrationModel } from '@/server/models';
import { ResourceObject, NewIllustration, Illustration } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Illustration>> => {
    const { id: creator } = authenticate(event.context);
    const issue = getRouterParam(event, 'id');

    const newIllustration: NewIllustration & { image?: string } =
      await readBody(event);
    const illustration = await IllustrationModel.create({
      creator,
      issue,
      ...newIllustration,
    });

    if (!illustration) {
      throw new Error('Illustration creation failed');
    }
    return { data: illustration };
  }
);
