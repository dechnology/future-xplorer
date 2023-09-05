import {
  Persona,
  Workshop,
  Issue,
  Case,
  IssueTabs,
  IssueTab,
  Keyword,
} from '@/types';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
  const elements = computed(() => {
    if (workshop.value) {
      const { objects, environments, messages, services } = workshop.value;
      return {
        objects,
        environments,
        messages,
        services,
      };
    }
  });

  const issue = ref<Issue | null>(null);
  const issueId = computed(() => issue.value?._id);
  const currentTab = ref<IssueTab>(IssueTabs.persona);

  const personas = computed((): Persona[] =>
    issue.value ? issue.value.personas : []
  );

  const cases = computed((): Case[] => (issue.value ? issue.value.cases : []));

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

  function upsertPersona(el: Persona) {
    if (!issue.value) {
      return;
    }

    const index = issue.value?.personas.findIndex(
      (persona) => persona._id === el._id
    );

    if (index === -1) {
      issue.value.personas.push(el);
    } else {
      issue.value.personas[index] = el;
    }
  }

  function removePersona(id: string) {
    if (!issue.value) {
      return;
    }

    const index = issue.value?.personas.findIndex(
      (persona) => persona._id === id
    );

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issue.value.personas.splice(index, 1);
    }
  }

  function upsertCase(el: Case) {
    if (!issue.value) {
      return;
    }

    const index = issue.value?.cases.findIndex((c) => c._id === el._id);

    if (index === -1) {
      issue.value.cases.push(el);
    } else {
      issue.value.cases[index] = el;
    }
  }

  function removeCase(id: string) {
    if (!issue.value) {
      return;
    }

    const index = issue.value?.cases.findIndex((c) => c._id === id);

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issue.value.cases.splice(index, 1);
    }
  }

  function getUserKeywords() {
    if (!issue.value || !cases.value) {
      return null;
    }
    const allKeywords: Keyword[] = [];
    for (const c of cases.value) {
      allKeywords.push(...c.keywords);
    }
    return allKeywords;
  }

  return {
    workshop,
    elements,

    issue,
    issueId,
    currentTab,

    personas,
    cases,
    keywords,

    init,
    upsertPersona,
    removePersona,
    upsertCase,
    removeCase,
    getUserKeywords,
  };
});
