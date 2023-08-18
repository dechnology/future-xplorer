import { NewIssue, Issue, BaseIssue } from '@/types';

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

  const { issues: serializedBaseIssues } = data.value;

  return {
    issues: serializedBaseIssues.map((i) => deserializeBaseIssue(i)),
  };
};

export const fetchIssue = async (
  token: string,
  issueId: string
): Promise<{ issue: Issue }> => {
  const { data, error } = await useFetch(`/api/issues/${issueId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { issue: serializedIssue } = data.value;

  return {
    issue: deserializeIssue(serializedIssue),
  };
};

export const createIssue = async (
  token: string,
  workshopId: string,
  i: NewIssue
): Promise<BaseIssue> => {
  const { data, error } = await useFetch(
    `/api/workshops/${workshopId}/issues`,
    {
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      body: i,
    }
  );

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { issue: serializedBaseIssue } = data.value;

  return deserializeBaseIssue(serializedBaseIssue);
};

export const updateIssue = async (
  token: string,
  issueId: string,
  i: NewIssue
): Promise<Issue> => {
  const { data, error } = await useFetch(`/api/issues/${issueId}`, {
    method: 'put',
    headers: { Authorization: `Bearer ${token}` },
    body: i,
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { issue: serializedIssue } = data.value;

  return deserializeIssue(serializedIssue);
};

export const deleteIssue = async (
  token: string,
  issueId: string
): Promise<{ message: string; issue: Issue | null }> => {
  const { data, error } = await useFetch(`/api/issues/${issueId}`, {
    method: 'delete',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  const { message, issue: serializedIssue } = data.value;

  return {
    message,
    issue: serializedIssue && deserializeIssue(serializedIssue),
  };
};
