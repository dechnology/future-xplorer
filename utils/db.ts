import { Serialize } from 'nitropack';
import { Issue } from '@/types/issue';
import { Workshop } from '@/types/workshop';

const convertSerializedWorkshop = (serialized: Serialize<Workshop>) =>
  ({
    ...serialized,
    createdAt: convertDateStr(serialized.createdAt),
    updatedAt: convertDateStr(serialized.updatedAt),
    startAt: convertDateStr(serialized.startAt),
    endAt: convertDateStr(serialized.endAt),
    elements: serialized.elements.map((el) => ({
      ...el,
      createdAt: convertDateStr(el.createdAt),
      updatedAt: convertDateStr(el.updatedAt),
    })),
  }) as Workshop;

const convertSerializedIssue = (serialized: Serialize<Issue>) =>
  ({
    ...serialized,
    createdAt: convertDateStr(serialized.createdAt),
    updatedAt: convertDateStr(serialized.updatedAt),
  }) as Issue;

export const fetchIssueById = async (workshopId: number, issueId: number) => {
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

  const { issue: serializedIssue, workshop: serializedWorkshop } = data.value;

  return {
    workshop: convertSerializedWorkshop(serializedWorkshop),
    issue: convertSerializedIssue(serializedIssue),
  };
};

export const fetchWorkshopById = async (id: string) => {
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
    issues: serializedIssues.map((serializedIssue) =>
      convertSerializedIssue(serializedIssue)
    ),
  };
};

export const fetchAllWorkshops = async () => {
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
