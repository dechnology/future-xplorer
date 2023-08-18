import type { Case, NewCase, CardState } from '@/types';
import { CardStates } from '@/types';

const getNewCase = (): NewCase => ({
  title: '',
  background: '',
  method: '',
  goal: '',
  challenge: '',
  result: '',
  reference: '',
  other: '',
});

export const useCaseCardStore = definePiniaStore('case card', () => {
  const currentCase = ref<Case | NewCase>(getNewCase());
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);

  function clearCurrentCase() {
    currentCase.value = getNewCase();
  }

  function clearActiveId() {
    activeId.value = null;
  }

  function setCurrentCase(c: Case) {
    currentCase.value = { ...c };
  }

  function setActiveId(id: string) {
    activeId.value = id;
  }

  watch(state, (newState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveId();
      clearCurrentCase();
    }
  });

  return {
    currentCase,
    activeId,
    state,

    clearCurrentCase,
    clearActiveId,
    setCurrentCase,
    setActiveId,
  };
});
