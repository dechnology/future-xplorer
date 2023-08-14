import { NewWorkshop, Workshop } from '@/types/workshop';
import { BaseIssue, Issue } from '@/types/issue';

export const fetchWorkshops = async (token: string): Promise<Workshop[]> => {
  const { data, error } = await useFetch('/api/workshops', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { workshops: serializedWorkshops } = data.value;

  return serializedWorkshops.map((w) => deserializeWorkshop(w));
};

export const fetchWorkshop = async (
  token: string,
  workshopId: string
): Promise<{ workshop: Workshop }> => {
  const { data, error } = await useFetch(`/api/workshops/${workshopId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { workshop: serializedWorkshop } = data.value;

  return {
    workshop: deserializeWorkshop(serializedWorkshop),
  };
};

export const fetchWorkshopIssues = async (
  token: string,
  workshopId: string
): Promise<{ issues: BaseIssue[] }> => {
  const { data, error } = await useFetch(
    `/api/workshops/${workshopId}/issues`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { issues: serializeBaseIssues } = data.value;

  return {
    issues: serializeBaseIssues.map((i) => deserializeBaseIssue(i)),
  };
};

export const fetchWorkshopIssue = async (
  token: string,
  workshopId: string,
  issueId: string
): Promise<{ issue: Issue }> => {
  const { data, error } = await useFetch(
    `/api/workshops/${workshopId}/issues/${issueId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { issue: serializeIssue } = data.value;

  return {
    issue: deserializeIssue(serializeIssue),
  };
};

export const createWorkshop = async (
  token: string,
  w: NewWorkshop
): Promise<Workshop> => {
  const { data, error } = await useFetch('/api/workshops', {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body: w,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { workshop: serializedWorkshop } = data.value;

  return deserializeWorkshop(serializedWorkshop);
};
