import type { Persona, ResourceObject } from '@/types';
import { PersonaModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Persona>> => {
    authenticate(event.context);
    const personaId = getRouterParam(event, 'persona');
    const persona = await PersonaModel.findByIdAndDelete(personaId);

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
