import {
  Persona,
  Workshop,
  Issue,
  Case,
  IssueResources,
  WorkshopElements,
  Keyword,
} from '@/types';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
  const issue = ref<Issue | null>(null);

  const elements = computed((): WorkshopElements | null => {
    if (!workshop.value) {
      return null;
    }

    const { objects, environments, messages, services } = workshop.value;
    return {
      objects,
      environments,
      messages,
      services,
    };
  });

  const personas = computed(
    (): Persona[] | null => issue.value && issue.value.personas
  );

  const cases = computed((): Case[] | null => issue.value && issue.value.cases);

  const keywords = computed(() => {
    if (!issue.value || !cases.value) {
      return null;
    }
    const allKeywords: Keyword[] = [];
    for (const c of cases.value) {
      allKeywords.push(...c.keywords);
    }
    return allKeywords;
  });

  function getCaseKeywords(caseId: string) {
    return issue.value && keywords.value
      ? keywords.value.filter((k) => k.case === caseId)
      : [];
  }

  async function init(token: string, workshopId: string, issueId: string) {
    const [workshopResponse, issuesResponse] = await Promise.all([
      fetchResource<Workshop>(token, `/api/workshops/${workshopId}`),
      fetchResource<Issue>(token, `/api/issues/${issueId}`, {
        deserializer: deserializeIssue,
      }),
    ]);

    workshop.value = workshopResponse.data;
    issue.value = issuesResponse.data;
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

  function upsertCase(c: Case) {
    if (!issue.value) {
      throw new Error('issue is null');
    }

    const index = issue.value.cases.findIndex((_case) => _case._id === c._id);

    if (index === -1) {
      issue.value.cases.push(c);
    } else {
      issue.value.cases[index] = c;
    }
  }

  function removeCase(id: string) {
    if (!issue.value) {
      throw new Error('no issue available');
    }

    const index = issue.value.cases.findIndex((c) => c._id === id);

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issue.value.cases.splice(index, 1);
    }
  }

  return {
    workshop,
    issue,
    elements,
    personas,
    cases,
    keywords,

    getCaseKeywords,

    init,
    upsertPersona,
    removePersona,
    upsertCase,
    removeCase,
  };
});
