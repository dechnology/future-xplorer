import { Persona, ResourceObject } from '@/types';
import { PersonaModel } from '@/server/models';

interface PersonaQuery {
  issueId: string;
  searchQuery?: string;
}

export default defineEventHandler(
  async (event): Promise<ResourceObject<Omit<Persona, 'issue'>[]>> => {
    authenticate(event.context);

    const { issueId, searchQuery } = getQuery<PersonaQuery>(event);

    if (!issueId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Issue ID is required',
      });
    }

    const el = await PersonaModel.find({ issue: issueId }).populate('creator');

    console.log(el);

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Personas do not exist',
      });
    }

    return { data: el };
  }
);
