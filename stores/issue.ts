import {
  IssueTabsFormPanelProps,
  getNewCase,
  getNewKeyword,
  getNewPersona,
} from '~/utils';
import {
  FormStateKeys,
  Persona,
  Workshop,
  Issue,
  Case,
  Keyword,
  NewPersona,
  NewCase,
  NewKeyword,
  CurrentIssueResources,
  ActiveIssueResources,
  IssueResourceKeys,
  IssueTabs,
  User,
  IssueTab,
  IssueTabKeys,
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
  const currentTab = ref<IssueTab>(IssueTabs.persona);
  const currentResources = ref<CurrentIssueResources>({
    persona: getNewPersona(),
    case: getNewCase(),
  });
  const currentResource = computed(
    () => currentResources.value[currentTab.value.name]
  );
  const activeIds = ref<Record<IssueResourceKeys, string | null>>({
    persona: null,
    case: null,
  });
  const imageUrlBuffer = ref<string | null>(null);
  const imageFileBuffer = ref<File>();

  const state = ref<FormStateKeys>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formPanelProps = computed(
    () => IssueTabsFormPanelProps[currentTab.value.name]
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps(
      currentTab.value.resourceName,
      currentResource as { creator?: User; createdAt?: Date; updatedAt?: Date },
      state.value
    )
  );

  const personas = computed((): Persona[] =>
    issue.value ? issue.value.personas : []
  );
  const currentPersona = computed(() => currentResources.value.persona);
  const activePersona = computed(() => {
    const index = personas.value.findIndex(
      (el) => el._id === activeIds.value.persona
    );

    if (index == -1) {
      return null;
    }
    return personas.value[index];
  });

  // const cases = computed((): Case[] | null => issue.value && issue.value.cases);
  // const currentCase = ref<Case | NewCase>(getNewCase());
  // const activeCase = useArrayFind(
  //   cases && ([] as Case[]),
  //   (el) => el._id === activeId.value
  // );

  // const keywords = computed(() => {
  //   if (!issue.value || !cases.value) {
  //     return null;
  //   }
  //   const allKeywords: Keyword[] = [];
  //   for (const c of cases.value) {
  //     allKeywords.push(...c.keywords);
  //   }
  //   return allKeywords;
  // });
  // const currentKeyword = ref<Keyword | NewKeyword>(getNewKeyword());
  // const activeKeyword = useArrayFind(
  //   keywords && ([] as Keyword[]),
  //   (el) => el._id === activeId.value
  // );

  // function getCaseKeywords(caseId: string) {
  //   return issue.value && keywords.value
  //     ? keywords.value.filter((k) => k.case === caseId)
  //     : [];
  // }

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
    elements,

    issue,
    currentTab,
    currentResources,
    activeIds,
    imageUrlBuffer,
    imageFileBuffer,

    state,
    loading,
    formDisabled,
    formPanelProps,
    formCardProps,

    personas,
    currentPersona,
    activePersona,

    // cases,
    // currentCase,
    // activeCase,

    // keywords,
    // currentKeyword,
    // activeKeyword,

    // getCaseKeywords,

    init,
    upsertPersona,
    removePersona,
    upsertCase,
    removeCase,
  };
});
