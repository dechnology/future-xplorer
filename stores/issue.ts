import { Persona, Workshop, Issue, Case } from '@/types';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
  const issue = ref<Issue | null>(null);

  const personas = computed(
    (): Persona[] | null => issue.value && (issue.value.personas as Persona[])
  );

  const cases = computed((): Case[] | null => issue.value && issue.value.cases);

  async function init(token: string, workshopId: string, issueId: string) {
    const [workshopResponse, issuesResponse] = await Promise.all([
      fetchResource<Workshop>(token, `/api/workshops/${workshopId}`),
      fetchResource<Issue>(token, `/api/issues/${issueId}`, {
        deserializer: deserializeIssue,
      }),
    ]);

    workshop.value = workshopResponse.data;
    issue.value = issuesResponse.data;

    console.log(issue.value.cases);
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

  function removePersona(id: string) {
    if (!issue.value) {
      throw new Error('no issue available');
    }

    const index = issue.value.personas.findIndex((p) => p._id === id);

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issue.value.personas.splice(index, 1);
    }
  }

  return {
    workshop,
    issue,
    personas,
    cases,

    init,
    upsertPersona,
    removePersona,
  };
});
