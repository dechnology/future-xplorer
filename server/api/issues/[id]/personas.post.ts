import { PersonaModel } from '@/server/models';
import { ResourceObject, NewPersona, Persona } from '@/types';

export default defineEventHandler(
  async (event): Promise<ResourceObject<Persona>> => {
    const { id: creator } = authenticate(event.context);
    const issue = getRouterParam(event, 'id');

    const newPersona: NewPersona = await readBody(event);
    const persona = await PersonaModel.create({
      creator,
      issue,
      ...newPersona,
    });

    if (!persona) {
      throw new Error('Persona creation failed');
    }
    return { data: persona };
  }
);
