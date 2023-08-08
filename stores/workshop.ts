import {
  NewWorkshop,
  Workshop,
  WorkshopState,
  WorkshopStates,
} from '@/types/workshop';
import { Issue, IssueState, IssueStates } from '@/types/issue';

const newWorkshop = {
  name: '',
  description: '',

  elements: new Set([
    { name: '技術', category: 'object' },
    { name: '場景體驗', category: 'environment' },
    { name: '洞見與價值', category: 'message' },
    { name: '使用者體驗', category: 'service' },
  ]),
} as NewWorkshop;

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<Workshop[] | null>(null);
  const activeWorkshop = ref<Workshop | null>(null);

  const cachedWorkshop = ref<Workshop | NewWorkshop | null>(null);
  const currentWorkshop = ref<Workshop | NewWorkshop>(newWorkshop);

  const loading = ref(true);
  const state = ref<WorkshopState>(WorkshopStates.New);

  async function initStore() {
    workshops.value = await fetchAllWorkshops();

    resetCurrentWorkshop();

    // console.log(workshops.value);

    // TODO: retrieve cached issue from session/local storage
  }

  function resetCurrentWorkshop() {
    currentWorkshop.value = { ...EmptyWorkshop, creator: 'HEHE4' };
  }

  function setCurrentWorkshop(cached: boolean = true) {
    if (cached) {
      if (cachedWorkshop.value === null) {
        resetCurrentWorkshop();
      } else {
        currentWorkshop.value = { ...cachedWorkshop.value };
      }
      return;
    }

    if (!activeWorkshop.value) {
      throw Error('no issue seleted');
    }
    currentWorkshop.value = { ...activeWorkshop.value };
  }

  function cacheWorkshop() {}

  watch(state, (newState, oldState) => {
    if (oldState.name === WorkshopStates.New.name) {
      cacheWorkshop();
    }

    if (newState.name === WorkshopStates.New.name) {
      setCurrentWorkshop(true);
    }
  });

  return {
    workshops,
    cachedWorkshop,

    activeWorkshop,
    currentWorkshop,

    loading,
    state,

    initStore,
    resetCurrentWorkshop,
    setCurrentWorkshop,
    cacheWorkshop,
  };
});

export const useWorkshopStore = definePiniaStore('workshop', () => {
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

  async function initStore(workshopId: number) {
    if (workshopId === workshop.value?.id) {
      console.log('workshop already fetched');
      return;
    }

    console.log('fetching workshop...');
    const data = await fetchWorkshopById(workshopId);

    workshop.value = data.workshop;
    issues.value = data.issues;
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

    initStore,
    resetCurrentIssue,
    setCurrentIssue,
    cacheIssue,
  };
});
