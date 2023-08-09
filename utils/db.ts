import { Issue } from '@/types/issue';
import { BaseWorkshop, Workshop } from '@/types/workshop';

export const fetchIssueById = async (
  workshopId: string,
  issueId: string,
  opts: { withWorkshop: boolean } = { withWorkshop: false }
): Promise<{ workshop?: BaseWorkshop; issue: Issue }> => {
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

  const { workshop: w, issue: i } = data.value;

  return {
    workshop: opts.withWorkshop ? deserializeBaseWorkshop(w) : undefined,
    issue: deserializeIssue(i),
  };
};

export const fetchWorkshopById = async (id: string): Promise<Workshop> => {
  const { data } = await useFetch(`/api/workshops/${id}`);

  // Fetching error
  if (data.value === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch workshop by id',
    });
  }

  const { workshop: serializedWorkshop } = data.value;

  return deserializeWorkshop(serializedWorkshop);
};

export const fetchAllWorkshops = async (): Promise<BaseWorkshop[]> => {
  const { data } = await useFetch('/api/workshops');

  // Fetching error
  if (data.value === null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch all workshops',
    });
  }

  const { baseWorkshops: serializedBaseWorkshops } = data.value;

  return serializedBaseWorkshops.map((w) => deserializeBaseWorkshop(w));
};
