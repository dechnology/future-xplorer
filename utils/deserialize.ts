import { Serialize } from 'nitropack';
import type { Base, User, Workshop, BaseIssue, Issue, Persona } from '@/types';

export const deserializerFactory =
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

export const deserializeBase = deserializerFactory<Base>();
export const deserializeWorkshop = deserializerFactory<Workshop>();
export const deserializePersona = deserializerFactory<Persona>();

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
    personas: personas && personas.map((p) => deserializePersona(p)),
  };
};
