import { FilterQuery } from 'mongoose';
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

    const filter: FilterQuery<Persona> = { issue: issueId };
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      filter.$or = [
        { role: searchRegex },
        { name: searchRegex },
        { age: searchRegex },
        { gender: searchRegex },
        { trait: searchRegex },
        { other: searchRegex },
      ];
    }

    const el = await PersonaModel.find(filter).populate('creator');

    if (!el) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Personas do not exist',
      });
    }

    return { data: el };
  }
);
