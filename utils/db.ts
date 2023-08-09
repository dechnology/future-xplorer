import { Serialize } from 'nitropack';
import { Issue } from '@/types/issue';
import { Workshop } from '@/types/workshop';
import { Character } from 'types/character';

const convertSerializedWorkshop = (serialized: Serialize<Workshop>) =>
  ({
    ...serialized,
    createdAt: convertDateStr(serialized.createdAt),
    updatedAt: convertDateStr(serialized.updatedAt),
    startAt: convertDateStr(serialized.startAt),
    endAt: convertDateStr(serialized.endAt),
  }) as Workshop;

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

const convertSerializedIssue = (serialized: Serialize<Issue>) =>
  ({
    ...serialized,
    createdAt: convertDateStr(serialized.createdAt),
    updatedAt: convertDateStr(serialized.updatedAt),
    charaters: serialized.charaters
      ? serialized.charaters.map((charater) =>
          convertSerializedBase(charater as Serialize<Character>)
        )
      : undefined,
  }) as Issue;

export const fetchIssueById = async (
  workshopId: string,
  issueId: string,
  opts: { withWorkshop: boolean } = { withWorkshop: false }
) => {
  const { data } = await useFetch(
    `/api/workshops/${workshopId}/issues/${issueId}`
  );

  // Fetching error
  if (data.value === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch workshop by id',
    });
  }

  const { workshop: serializedWorkshop, issue: serializedIssue } = data.value;

  return {
    workshop: opts.withWorkshop
      ? convertSerializedWorkshop(serializedWorkshop)
      : undefined,
    issue: convertSerializedIssue(serializedIssue),
  };
};

export const fetchWorkshopById = async (
  id: string,
  opts: { withIssues: boolean } = { withIssues: false }
) => {
  const { data } = await useFetch(`/api/workshops/${id}`);

  // Fetching error
  if (data.value === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch workshop by id',
    });
  }

  const { issues: serializedIssues, workshop: serializedWorkshop } = data.value;

  return {
    workshop: convertSerializedWorkshop(serializedWorkshop),
    issues: opts.withIssues
      ? serializedIssues.map((serializedIssue) =>
          convertSerializedIssue(serializedIssue)
        )
      : undefined,
  };
};

export const fetchAllWorkshops = async (
  opts: { withIssues: boolean } = { withIssues: false }
) => {
  const { data } = await useFetch('/api/workshops');

  // Fetching error
  if (data.value === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch all workshops',
    });
  }

  return data.value.map((serializedWorkshop) =>
    convertSerializedWorkshop(serializedWorkshop)
  );
};
