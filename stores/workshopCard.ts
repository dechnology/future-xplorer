import { format } from 'date-fns';
import type { NewWorkshop, Workshop, CardState } from '@/types';
import { NewWorkshopSchema, CardStates } from '@/types';
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

  async function submit(token: string): Promise<Workshop> {
    const validationResult = NewWorkshopSchema.parse(currentWorkshop.value);

    console.log('Creating: ', validationResult);
    const createdWorkshop = await createWorkshop(token, validationResult);

    return createdWorkshop;
  }

  async function edit(token: string, workshopId: string): Promise<Workshop> {
    const validationResult = NewWorkshopSchema.parse(currentWorkshop.value);

    console.log('Patch: ', validationResult);
    const editedWorkshop = await updateWorkshop(token, workshopId, {
      ...currentWorkshop.value,
    });

    return editedWorkshop;
  }

  async function remove(token: string, workshopId: string) {
    const data = await deleteWorkshop(token, workshopId);
    console.log(data);
  }

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

    submit,
    edit,
    remove,
  };
});
