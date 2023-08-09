import { NewWorkshop, Workshop } from '@/types/workshop';
import { CardState, CardStates } from '@/types/cardState';

const newWorkshop = {
  name: '',
  description: '',

  elements: [
    { name: '技術', category: 'object' },
    { name: '場景體驗', category: 'environment' },
    { name: '洞見與價值', category: 'message' },
    { name: '使用者體驗', category: 'service' },
  ],
} as NewWorkshop;

export const useWorkshopCardStore = definePiniaStore('workshop card', () => {
  const activeWorkshop = ref<Workshop | null>(null);
  const currentWorkshop = ref<Workshop | NewWorkshop>(newWorkshop);
  const state = ref<CardState>(CardStates.New);

  function clearCurrentWorkshop() {
    currentWorkshop.value = { ...newWorkshop, creatorId: "HEHE's id" };
  }

  function setCurrentWorkshop(w: Workshop) {
    currentWorkshop.value = { ...w };
  }

  function clearActiveWorkshop() {
    activeWorkshop.value = null;
  }

  function setActiveWorkshop(w: Workshop) {
    activeWorkshop.value = { ...w };
  }

  watch(state, (newState, oldState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveWorkshop();
      clearCurrentWorkshop();
    }
  });

  return {
    activeWorkshop,
    currentWorkshop,
    state,

    clearCurrentWorkshop,
    setCurrentWorkshop,
    clearActiveWorkshop,
    setActiveWorkshop,
  };
});
