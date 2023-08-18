import { format } from 'date-fns';
import type { NewWorkshop, Workshop, CardState } from '@/types';
import { NewWorkshopSchema, CardStates } from '@/types';

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
  const loading = ref(false);

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
    loading.value = true;
    const w = NewWorkshopSchema.parse(currentWorkshop.value);

    console.log('Creating: ', w);
    // const createdWorkshop = await createWorkshop(token, validationResult);
    const { data } = await fetchResource<Workshop>(token, `/api/workshops`, {
      method: 'post',
      body: w,
    });

    console.log('Created: ', data);
    loading.value = false;

    return data;
  }

  async function edit(token: string, workshopId: string): Promise<Workshop> {
    loading.value = true;
    const w = NewWorkshopSchema.parse(currentWorkshop.value);

    console.log('Patch: ', w);
    const { data } = await fetchResource<Workshop>(
      token,
      `/api/workshops/${workshopId}`,
      { method: 'put', body: w }
    );

    loading.value = false;
    return data;
  }

  async function remove(token: string, workshopId: string) {
    loading.value = true;
    const { message } = await fetchResource<Workshop>(
      token,
      `/api/workshops/${workshopId}`,
      { method: 'delete' }
    );
    // const data = await deleteWorkshop(token, workshopId);
    console.log(message);
    loading.value = false;
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
    loading,

    clearCurrentWorkshop,
    setCurrentWorkshop,
    clearActiveId,
    setActiveId,

    submit,
    edit,
    remove,
  };
});
