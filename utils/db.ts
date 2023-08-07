import { Issue } from '@/types/issue';
import { Workshop, WorkshopElement } from '@/types/workshop';

interface RawWorkshop {
  name: string;
  description: string;
  creator: string;
  id?: number;
  createdAt?: string;
  updatedAt?: string;

  startAt?: string;
  endAt?: string;

  elements: WorkshopElement[];
}

interface RawIssue {
  title: string;
  description: string;
  creator: string;
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

const convertRawWorkshop = (raw: RawWorkshop) =>
  ({
    ...raw,
    createdAt: convertDateStr(raw.createdAt),
    updatedAt: convertDateStr(raw.updatedAt),
    startAt: convertDateStr(raw.startAt),
    endAt: convertDateStr(raw.endAt),
  }) as Workshop;

const convertRawIssue = (raw: RawIssue) =>
  ({
    ...raw,
    createdAt: convertDateStr(raw.createdAt),
    updatedAt: convertDateStr(raw.updatedAt),
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

  const { issue: rawIssue, workshop: rawWorkshop } = data.value;

  return {
    workshop: convertRawWorkshop(rawWorkshop),
    issue: convertRawIssue(rawIssue),
  };
};

export const fetchWorkshopById = async (id: number) => {
  const { data } = await useFetch(`/api/workshops/${id}`);

  // Fetching error
  if (data.value === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch workshop by id',
    });
  }

  const { issues: rawIssues, workshop: rawWorkshop } = data.value;

  return {
    workshop: convertRawWorkshop(rawWorkshop),
    issues: rawIssues.map((rawIssue) => convertRawIssue(rawIssue)),
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

  return data.value.map((rawWorkshop) => convertRawWorkshop(rawWorkshop));
};
