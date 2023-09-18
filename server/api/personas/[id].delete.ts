import type { Persona, ResourceObject } from '@/types';
import { PersonaModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Persona>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const persona = await PersonaModel.findByIdAndDelete(id);

    if (!persona) {
      throw createError({
        statusCode: 400,
        statusMessage: 'issue does not exist',
      });
    }

    return {
      message: 'persona successfully deleted',
      data: persona,
    };
  }
);
