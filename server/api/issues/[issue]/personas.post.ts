import { PersonaModel } from '@/server/models';
import { NewPersona, Persona } from '@/types/persona';

export default defineEventHandler(
  async (event): Promise<{ persona: Persona }> => {
    const { id: creator } = authenticate(event.context);
    const issue = getRouterParam(event, 'issue');

    const newPersona: NewPersona = await readBody(event);
    const persona = await PersonaModel.create({
      creator,
      issue,
      ...newPersona,
    });
    if (!persona) {
      throw Error('Persona creation failed');
    }
    return { persona };
  }
);
