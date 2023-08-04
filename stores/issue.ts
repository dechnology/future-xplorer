import { Issue, IssueState, IssueStates } from '@/types/issue';

const emptyIssue = {
  title: '',
  creator: '',
  description: '',
} as Issue;

export const useIssueStore = definePiniaStore('issue', () => {
  const issues = ref<Issue[] | null>(null);
  const activeIssue = ref<Issue | null>(null);
  const cachedIssue = ref<Issue | null>(null);

  const currentIssue = ref<Issue>(emptyIssue);
  const issueTemplate = ref<Issue>(emptyIssue);

  const state = ref<IssueState>(IssueStates.New);
  const modalShown = ref(false);

  function updateTemplate(newIssueTemplate: Issue) {
    issueTemplate.value = { ...newIssueTemplate };
  }

  function resetCurrentIssue() {
    currentIssue.value = { ...issueTemplate.value };
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
    console.log(oldState);
    // We will use cached form inputs if possible when in New state
    setCurrentIssue(newState.name === IssueStates.New.name);
    if (oldState.name === IssueStates.New.name) {
      cacheIssue();
    }
  });

  return {
    issues,
    activeIssue,
    currentIssue,
    state,
    modalShown,
    updateTemplate,
    resetCurrentIssue,
    setCurrentIssue,
  };
});
