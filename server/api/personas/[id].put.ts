import type { NewPersona, Persona, ResourceObject } from '@/types';
import { PersonaModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Persona>> => {
    authenticate(event.context);
    const id = getRouterParam(event, 'id');
    const newPersona: NewPersona = await readBody(event);
    const persona = await PersonaModel.findByIdAndUpdate(id, newPersona, {
      new: true,
    });

    if (!persona) {
      throw new Error('Persona update failed');
    }
    return { data: persona };
  }
);
