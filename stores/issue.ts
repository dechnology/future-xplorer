import { Workshop } from './../types/workshop';
import { Issue, IssueState, IssueStates } from '@/types/issue';

const EmptyIssue = {
  title: '',
  creator: '',
  description: '',
} as Issue;

export const useIssueStore = definePiniaStore('issue', () => {
  // fetched
  const workshop = ref<Workshop | null>(null);
  const issues = ref<Issue[] | null>(null);
  const cachedIssue = ref<Issue | null>(null);

  // current session usage
  const activeIssue = ref<Issue | null>(null);
  const currentIssue = ref<Issue>({
    title: '',
    creator: '',
    description: '',
  });

  const loading = ref(true);
  const state = ref<IssueState>(IssueStates.New);
  const modalShown = ref(false);

  async function initStore(workshopId: number) {
    // const { data } = await useFetch(`/api/workshops/${workshopId}`);
    const { data } = await useAsyncData(`workshop-${workshopId}`, () =>
      $fetch(`/api/workshops/${workshopId}`)
    );

    // Fetching error
    if (data.value === null) {
      return;
    }

    const { issues: rawIssues, workshop: rawWorkshop } = data.value;

    workshop.value = {
      ...rawWorkshop,
      createdAt: convertDateStr(rawWorkshop.createdAt),
      updatedAt: convertDateStr(rawWorkshop.updatedAt),
      startAt: convertDateStr(rawWorkshop.startAt),
      endAt: convertDateStr(rawWorkshop.endAt),
    };

    issues.value = rawIssues.map((issue) => ({
      ...issue,
      createdAt: convertDateStr(issue.createdAt),
      updatedAt: convertDateStr(issue.updatedAt),
    }));

    // await new Promise((r) => setTimeout(r, 2000));

    // TODO: retrieve cached issue from session/local storage
  }

  function resetCurrentIssue() {
    currentIssue.value = {
      title: '',
      creator: '',
      description: '',
    };
  }

  function setCurrentIssue(cached: boolean = true) {
    if (cached) {
      if (cachedIssue.value === null) {
        resetCurrentIssue();
      } else {
        currentIssue.value = { ...cachedIssue.value };
      }
      return;
    }

    if (!activeIssue.value) {
      throw Error('no issue seleted');
    }
    currentIssue.value = { ...activeIssue.value };
  }

  function cacheIssue() {}

  watch(state, (newState, oldState) => {
    // We will use cached form inputs if possible when in New state
    setCurrentIssue(newState.name === IssueStates.New.name);
    if (oldState.name === IssueStates.New.name) {
      cacheIssue();
    }
  });

  return {
    workshop,
    issues,
    cachedIssue,

    activeIssue,
    currentIssue,

    loading,
    state,
    modalShown,

    initStore,
    resetCurrentIssue,
    setCurrentIssue,
    cacheIssue,
  };
});
