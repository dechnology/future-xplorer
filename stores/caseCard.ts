import { Case, NewCase } from '@/types/case';
import { CardState, CardStates } from '@/types/cardState';

const newCase = {
  title: '',
  background: '',
  method: '',
  goal: '',
  challenge: '',
  result: '',
  reference: '',
  other: '',

  keywords: [],
} as NewCase;

export const useCaseCardStore = definePiniaStore('case card', () => {
  // current session usage
  const activeCase = ref<Case | null>(null);
  const currentCase = ref<Case | NewCase>(newCase);
  const state = ref<CardState>(CardStates.New);

  function clearCurrentCase() {
    currentCase.value = { ...newCase, creatorId: "HEHE's id" };
  }

  function clearActiveCase() {
    activeCase.value = null;
  }

  function setCurrentCase(c: Case) {
    currentCase.value = { ...c };
  }

  function setActiveCase(c: Case) {
    activeCase.value = { ...c };
  }

  watch(state, (newState, oldState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveCase();
      clearCurrentCase();
    }
  });

  return {
    activeCase,
    currentCase,
    state,

    clearActiveCase,
    clearCurrentCase,
    setActiveCase,
    setCurrentCase,
  };
});
