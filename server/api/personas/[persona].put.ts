import type { NewPersona, Persona, ResourceObject } from '@/types';
import { PersonaModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Persona>> => {
    authenticate(event.context);
    const personaId = getRouterParam(event, 'persona');
    const newPersona: NewPersona = await readBody(event);
    const persona = await PersonaModel.findByIdAndUpdate(
      personaId,
      newPersona,
      {
        new: true,
      }
    );

    if (!persona) {
      throw Error('Persona update failed');
    }
    return { data: persona };
  }
);
