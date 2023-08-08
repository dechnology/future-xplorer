import { zh_TW, fakerZH_TW } from '@faker-js/faker';
import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Issue } from '@/types/issue';
import { Workshop } from '@/types/workshop';

const getBase = () => {
  const updatedAt = fakerZH_TW.date.recent();
  const createdAt = fakerZH_TW.date.recent({ refDate: updatedAt });
  return {
    id: fakerZH_TW.database.mongodbObjectId(),
    createdAt: createdAt,
    updatedAt: updatedAt,
    creatorId: fakerZH_TW.database.mongodbObjectId(),
  } as Base;
};

export const getUsers = (n: number) =>
  Array.from({ length: n }, () => {
    return {
      ...getBase(),
      name: fakerZH_TW.person.fullName(),
      uid: fakerZH_TW.database.mongodbObjectId(),
    } as User;
  });

export const getWorkshops = (n: number) =>
  Array.from({ length: n }, () => {
    const base = getBase();
    const startAt = fakerZH_TW.date.soon({ refDate: base.updatedAt });
    const endAt = fakerZH_TW.date.future({ refDate: startAt });
    return {
      ...base,
      name: fakerZH_TW.lorem.word(),
      description: fakerZH_TW.lorem.paragraph(),
      startAt: startAt,
      endAt: endAt,
    } as Workshop;
  });

export const getIssues = (n: number) =>
  Array.from(
    { length: n },
    () =>
      ({
        ...getBase(),
        title: fakerZH_TW.lorem.word(),
        description: fakerZH_TW.lorem.paragraph(),
      }) as Issue
  );
