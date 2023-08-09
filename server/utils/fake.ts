import { zh_TW, fakerZH_TW } from '@faker-js/faker';
import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Issue } from '@/types/issue';
import { Workshop, WorkshopElement } from '@/types/workshop';
import { Character } from '@/types/character';

const getBase = (
  opts: { withCreatorId: boolean } = { withCreatorId: true }
) => {
  const updatedAt = fakerZH_TW.date.recent();
  const createdAt = fakerZH_TW.date.recent({ refDate: updatedAt });
  return {
    id: fakerZH_TW.database.mongodbObjectId(),
    createdAt: createdAt,
    updatedAt: updatedAt,
    creatorId: opts.withCreatorId
      ? fakerZH_TW.database.mongodbObjectId()
      : undefined,
  } as Base;
};

export const getUser = () =>
  ({
    ...(getBase({ withCreatorId: false }) as {
      id: string;
      createdAt: Date;
      updatedAt: Date;
    }),
    name: fakerZH_TW.person.fullName(),
    uid: fakerZH_TW.database.mongodbObjectId(),
  }) as User;

export const getUsers = (n: number) =>
  Array.from({ length: n }, () => getUser());

export const getWorkshopElement = () =>
  ({
    ...getBase(),
    name: fakerZH_TW.lorem.word(),
    category: fakerZH_TW.helpers.arrayElement([
      'object',
      'environment',
      'message',
      'service',
    ]),
    workshopId: '',
  }) as WorkshopElement;

export const getWorkshopElements = (n: number) =>
  Array.from({ length: n }, () => getWorkshopElement());

export const getWorkshop = () => {
  const base = getBase();
  const startAt = fakerZH_TW.date.soon({ refDate: base.updatedAt });
  const endAt = fakerZH_TW.date.future({ refDate: startAt });
  return {
    ...base,
    name: fakerZH_TW.lorem.word(),
    description: fakerZH_TW.lorem.paragraph(),
    startAt: startAt,
    endAt: endAt,
    elements: getWorkshopElements(10),
  } as Workshop;
};

export const getWorkshops = (n: number) =>
  Array.from({ length: n }, () => getWorkshop());

export const getCharacter = () =>
  ({
    ...getBase(),
    role: fakerZH_TW.person.zodiacSign(),
    name: fakerZH_TW.person.fullName(),
    age: fakerZH_TW.number.int(),
    gender: fakerZH_TW.helpers.arrayElement(['male', 'female', 'nonbinary']),
    trait: fakerZH_TW.person.jobTitle(),
    other: fakerZH_TW.person.bio(),

    imageUrl: fakerZH_TW.image.avatar(),

    issueId: fakerZH_TW.database.mongodbObjectId(),
  }) as Character;

export const getCharacters = (n: number) =>
  Array.from({ length: n }, () => getCharacter());

export const getIssue = () =>
  ({
    ...getBase(),
    title: fakerZH_TW.lorem.word(),
    description: fakerZH_TW.lorem.paragraph(),
    charaters: getCharacters(20),
  }) as Issue;

export const getIssues = (n: number) =>
  Array.from({ length: n }, () => getIssue());
