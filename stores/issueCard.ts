import { BaseIssue, Issue, NewIssue } from '@/types/issue';
import { CardState, CardStates } from '@/types/cardState';

const newIssue = {
  title: '',
  description: '',
} as NewIssue;

export const useIssueCardStore = definePiniaStore('issue card', () => {
  const activeIssue = ref<Issue | BaseIssue | null>(null);
  const currentIssue = ref<Issue | BaseIssue | NewIssue>(newIssue);
  const state = ref<CardState>(CardStates.New);

  function clearCurrentIssue() {
    currentIssue.value = { ...newIssue };
  }

  function clearActiveIssue() {
    activeIssue.value = null;
  }

  function setCurrentIssue(w: Issue | BaseIssue) {
    currentIssue.value = { ...w };
  }

  function setActiveIssue(w: Issue | BaseIssue) {
    activeIssue.value = { ...w };
  }

  watch(state, (newState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveIssue();
      clearCurrentIssue();
    }
  });

  return {
    activeIssue,
    currentIssue,
    state,

    clearCurrentIssue,
    setCurrentIssue,
    clearActiveIssue,
    setActiveIssue,
  };
});
