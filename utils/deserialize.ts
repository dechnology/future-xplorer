import { Serialize } from 'nitropack';
import { Base } from '@/types/base';
import { User } from '@/types/user';
import { BaseWorkshop, Workshop } from '@/types/workshop';
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
      creator: serialized.creator && deserializeUser(serialized.creator),
    }) as T;

export const deserializeBaseIssue = baseDeserializerFactory<BaseIssue>();
export const deserializeCharacter = baseDeserializerFactory<Character>();
export const deserializeCase = baseDeserializerFactory<Case>();
export const deserializeKeyword = baseDeserializerFactory<Keyword>();

export const deserializeUser = (serialized: Serialize<User>): User => ({
  ...serialized,
  createdAt: convertDateStr(serialized.createdAt),
  updatedAt: convertDateStr(serialized.updatedAt),
});

export const deserializeBaseWorkshop = (
  serialized: Serialize<BaseWorkshop>
): BaseWorkshop => ({
  ...serialized,
  creator: serialized.creator && deserializeUser(serialized.creator),
  createdAt: convertDateStr(serialized.createdAt),
  updatedAt: convertDateStr(serialized.updatedAt),
  startAt: convertDateStr(serialized.startAt),
  endAt: convertDateStr(serialized.endAt),
});

export const deserializeWorkshop = (
  serialized: Serialize<Workshop>
): Workshop => ({
  ...serialized,
  createdAt: convertDateStr(serialized.createdAt),
  updatedAt: convertDateStr(serialized.updatedAt),
  startAt: convertDateStr(serialized.startAt),
  endAt: convertDateStr(serialized.endAt),
  creator: serialized.creator && deserializeUser(serialized.creator),
  issues: serialized.issues.map((issue) => deserializeBaseIssue(issue)),
  users: serialized.users.map((user) => deserializeUser(user)),
});

export const deserializeIssue = (serialized: Serialize<Issue>): Issue => ({
  ...serialized,
  createdAt: convertDateStr(serialized.createdAt),
  updatedAt: convertDateStr(serialized.updatedAt),
  creator: serialized.creator && deserializeUser(serialized.creator),
  users: serialized.users.map((user) => deserializeUser(user)),
  charaters: serialized.charaters.map((c) => deserializeCharacter(c)),
  cases: serialized.cases.map((c) => deserializeCase(c)),
  keywords: serialized.keywords.map((k) => deserializeKeyword(k)),
});
