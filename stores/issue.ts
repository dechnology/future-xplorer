import { Persona, Workshop, Issue } from '@/types';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
  const issue = ref<Issue | null>(null);

  const personas = computed(
    () => issue.value && (issue.value.personas as Persona[])
  );

  async function init(token: string, workshopId: string, issueId: string) {
    const results = await Promise.allSettled([
      fetchWorkshop(token, workshopId),
      fetchIssue(token, issueId),
    ]);

    const workshopResult = results[0];
    if (workshopResult.status === 'fulfilled') {
      workshop.value = workshopResult.value.workshop;
    } else {
      throw new Error(`Error fetching issues: ${workshopResult.reason}`);
    }

    const issueResult = results[1];
    if (issueResult.status === 'fulfilled') {
      issue.value = issueResult.value.issue;
    } else {
      throw new Error(`Error fetching issues: ${issueResult.reason}`);
    }

    console.log(issue.value);
  }

  function upsertPersona(p: Persona) {
    if (!issue.value) {
      throw new Error('issue is null');
    }

    const index = issue.value.personas.findIndex(
      (persona) => persona._id === p._id
    );

    if (index === -1) {
      issue.value.personas.push(p);
    } else {
      issue.value.personas[index] = p;
    }
  }

  return {
    workshop,
    issue,
    personas,
    init,
    upsertPersona,
  };
});
