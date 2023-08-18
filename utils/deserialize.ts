import { Serialize } from 'nitropack';
import type {
  Base,
  User,
  Workshop,
  BaseIssue,
  Issue,
  Persona,
  Case,
} from '@/types';

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

export const deserializeBaseIssue = deserializerFactory<BaseIssue>();
export const deserializePersona = deserializerFactory<Persona>();
export const deserializeCase = deserializerFactory<Case>();

export const deserializeIssue = (serialized: Serialize<Issue>): Issue => {
  const { users, personas, cases, ...serializedBaseIssue } = serialized;
  return {
    ...deserializeBaseIssue(serializedBaseIssue),
    users: users && users.map((u) => deserializeUser(u)),
    personas: personas.map((p) => deserializePersona(p)),
    cases: cases.map((c) => deserializeCase(c)),
  };
};
