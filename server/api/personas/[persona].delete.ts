import type { Persona } from '@/types';
import { PersonaModel } from '@/server/models';

export default defineEventHandler(
  async (event): Promise<{ message: string; persona: Persona | null }> => {
    authenticate(event.context);
    const personaId = getRouterParam(event, 'persona');
    const deletedPersona = await PersonaModel.findByIdAndDelete(personaId);
    return {
      message: deletedPersona
        ? 'persona successfully deleted'
        : 'persona not found',
      persona: deletedPersona,
    };
  }
);
