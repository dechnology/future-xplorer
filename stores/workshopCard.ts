import { NewWorkshop, Workshop } from '@/types/workshop';
import { CardState, CardStates } from '@/types/cardState';
import { format } from 'date-fns';
import { createWorkshop } from '@/utils/workshop';

const getNewWorkshop = (): NewWorkshop => {
  const now = format(new Date(), 'yyyy/MM/dd');

  return {
    name: '',
    description: '',

    dateValue: {
      start: now,
      end: now,
    },

    objects: ['技術'],
    environments: ['場景體驗'],
    messages: ['洞見與價值'],
    services: ['使用者體驗'],
  };
};

export const useWorkshopCardStore = definePiniaStore('workshop card', () => {
  const currentWorkshop = ref<NewWorkshop | Workshop>(getNewWorkshop());
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);

  function clearCurrentWorkshop() {
    currentWorkshop.value = getNewWorkshop();
  }

  function setCurrentWorkshop(w: NewWorkshop | Workshop) {
    currentWorkshop.value = { ...w };
  }

  function clearActiveId() {
    activeId.value = null;
  }

  function setActiveId(id: string) {
    activeId.value = id;
  }

  async function submitWorkshop(token: string): Promise<Workshop> {
    console.log(currentWorkshop.value);
    return await createWorkshop(token, { ...currentWorkshop.value });
  }

  async function editWorkshop(token: string) {}

  watch(state, (newState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveId();
      clearCurrentWorkshop();
    }
  });

  return {
    activeId,
    currentWorkshop,
    state,

    clearCurrentWorkshop,
    setCurrentWorkshop,
    clearActiveId,
    setActiveId,

    submitWorkshop,
    editWorkshop,
  };
});
