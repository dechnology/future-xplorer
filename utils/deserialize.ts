import { Serialize } from 'nitropack';
import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Workshop } from '@/types/workshop';
import { BaseIssue, Issue } from '@/types/issue';
import { Persona } from '../types/persona';
import { Case } from '@/types/case';
import { Keyword } from '@/types/keyword';

const baseDeserializerFactory =
  <T extends Base>() =>
  (serialized: Serialize<T>): T =>
    ({
      ...serialized,
      createdAt: convertDateStr(serialized.createdAt),
      updatedAt: convertDateStr(serialized.updatedAt),
      creator:
        typeof serialized.creator === 'string'
          ? serialized.creator
          : deserializeUser(serialized.creator),
    }) as T;

export const deserializeUser = (serialized: Serialize<User>): User => ({
  ...serialized,
  createdAt: convertDateStr(serialized.createdAt),
  updatedAt: convertDateStr(serialized.updatedAt),
});

export const deserializeBase = baseDeserializerFactory<Base>();
export const deserializeWorkshop = baseDeserializerFactory<Workshop>();
export const deserializePersona = baseDeserializerFactory<Persona>();

// export const deserializeCase = baseDeserializerFactory<Case>();
// export const deserializeKeyword = baseDeserializerFactory<Keyword>();

export const deserializeBaseIssue = (
  serialized: Serialize<BaseIssue>
): BaseIssue => {
  const { title, description, workshop, ...serializedBase } = serialized;
  return {
    ...deserializeBase(serializedBase),
    title,
    description,
    workshop:
      typeof workshop === 'string' ? workshop : deserializeWorkshop(workshop),
  };
};

export const deserializeIssue = (serialized: Serialize<Issue>): Issue => {
  const { users, personas, ...serializedBaseIssue } = serialized;
  return {
    ...deserializeBaseIssue(serializedBaseIssue),
    users: users && users.map((u) => deserializeUser(u)),
    personas: personas && personas.map((c) => deserializeCharacter(c)),
  };
};
