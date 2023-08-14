import { Serialize } from 'nitropack';
import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Workshop } from '@/types/workshop';
import { BaseIssue, Issue } from '@/types/issue';
import { Character } from '@/types/character';
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

export const deserializeWorkshop = baseDeserializerFactory<Workshop>();
export const deserializeBaseIssue = baseDeserializerFactory<BaseIssue>();

export const deserializeCharacter = baseDeserializerFactory<Character>();
export const deserializeCase = baseDeserializerFactory<Case>();
export const deserializeKeyword = baseDeserializerFactory<Keyword>();

// export const deserializeIssue = (serialized: Serialize<Issue>): Issue => ({
//   ...serialized,
//   createdAt: convertDateStr(serialized.createdAt),
//   updatedAt: convertDateStr(serialized.updatedAt),
//   creator:
//     typeof serialized.creator === 'string'
//       ? serialized.creator
//       : deserializeUser(serialized.creator),
//   users: serialized.users.map((user) => deserializeUser(user)),
//   charaters: serialized.charaters.map((c) => deserializeCharacter(c)),
//   cases: serialized.cases.map((c) => deserializeCase(c)),
//   keywords: serialized.keywords.map((k) => deserializeKeyword(k)),
// });
