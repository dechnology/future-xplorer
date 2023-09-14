import { Serialize } from 'nitropack';
import type {
  Base,
  User,
  BaseIssue,
  Issue,
  Persona,
  Case,
  PoemsTemplate,
  Story,
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
export const deserializePoemsTemplate = deserializerFactory<PoemsTemplate>();
export const deserializeStory = deserializerFactory<Story>();

export const deserializeIssue = (serialized: Serialize<Issue>): Issue => {
  const {
    users,
    personas,
    cases,
    poemsTemplates,
    stories,
    ...serializedBaseIssue
  } = serialized;
  return {
    ...deserializeBaseIssue(serializedBaseIssue),
    users: users && users.map((el) => deserializeUser(el)),
    personas: personas.map((el) => deserializePersona(el)),
    cases: cases.map((el) => deserializeCase(el)),
    poemsTemplates: poemsTemplates.map((el) => deserializePoemsTemplate(el)),
    stories: stories.map((el) => deserializeStory(el)),
  };
};
