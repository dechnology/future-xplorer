import { zh_TW, fakerZH_TW } from '@faker-js/faker';
import { Issue } from '@/types/issue';
import { Workshop } from '@/types/workshop';

export const getIssues = (n: number) =>
  Array.from({ length: n }, () => {
    const fakeDate = fakerZH_TW.date.recent();
    return {
      title: fakerZH_TW.lorem.word(),
      description: fakerZH_TW.lorem.paragraph(),
      creator: fakerZH_TW.person.fullName(),
      id: fakerZH_TW.number.int(),
      createdAt: fakerZH_TW.date.recent({ refDate: fakeDate }),
      updatedAt: fakeDate,
    } as Issue;
  });

export const getWorkshops = (n: number) =>
  Array.from({ length: n }, () => {
    const updatedAt = fakerZH_TW.date.recent();
    const createdAt = fakerZH_TW.date.recent({ refDate: updatedAt });
    const startAt = fakerZH_TW.date.soon({ refDate: updatedAt });
    const endAt = fakerZH_TW.date.future({ refDate: startAt });
    return {
      name: fakerZH_TW.lorem.word(),
      description: fakerZH_TW.lorem.paragraph(),
      creator: fakerZH_TW.person.fullName(),
      id: fakerZH_TW.number.int(),
      createdAt: createdAt,
      updatedAt: updatedAt,
      startAt: startAt,
      endAt: endAt,
    } as Workshop;
  });
