import { Serialize } from 'nitropack';
import { Workshop } from '@/types/workshop';
import { Issue } from 'types/issue';
import { Character } from 'types/character';

const convertSerializedBase = <
  T extends {
    createdAt: string;
    updatedAt: string;
  },
>(
  serialized: Serialize<T>
) =>
  ({
    ...serialized,
    createdAt: convertDateStr(serialized.createdAt),
    updatedAt: convertDateStr(serialized.updatedAt),
  }) as T;

export const convertSerializedWorkshop = (
  serialized: Serialize<Workshop>
): Workshop => ({
  ...serialized,
  createdAt: convertDateStr(serialized.createdAt),
  updatedAt: convertDateStr(serialized.updatedAt),
  startAt: convertDateStr(serialized.startAt),
  endAt: convertDateStr(serialized.endAt),
});

export const convertSerializedIssue = (serialized: Serialize<Issue>) => ({
  ...serialized,
  createdAt: convertDateStr(serialized.createdAt),
  updatedAt: convertDateStr(serialized.updatedAt),
  charaters: serialized.charaters.map((charater) =>
    convertSerializedBase(charater as Serialize<Character>)
  ),
});
