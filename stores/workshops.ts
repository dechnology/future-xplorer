import { FormStateKeys } from '@/types';
import type { NewWorkshop, Workshop } from '@/types';
import { getCurrentFormCardProps, getNewWorkshop } from '~/utils/form';

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<Workshop[]>([]);
  const currentWorkshop = ref<NewWorkshop | Workshop>(getNewWorkshop());

  const activeId = ref<string | null>(null);
  const activeWorkshop = useArrayFind(
    workshops,
    (w) => w._id === activeId.value
  );

  const state = ref<FormStateKeys>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const currentFormCardProps = computed(() =>
    getCurrentFormCardProps(
      '工作坊',
      currentWorkshop.value as Workshop,
      state.value
    )
  );

  async function init(token: string) {
    const { data } = await fetchResources<Workshop>(token, '/api/workshops');
    workshops.value = data;
  }

  function upsert(w: Workshop) {
    const index = workshops.value.findIndex(
      (workshop) => workshop._id === w._id
    );
    if (index === -1) {
      workshops.value.push(w);
    } else {
      workshops.value[index] = w;
    }
  }

  function remove(id: string) {
    const index = workshops.value.findIndex((workshop) => workshop._id === id);

    if (index === -1) {
      throw new Error('no workshop match given id');
    } else {
      workshops.value.splice(index, 1);
    }
  }

  function clearCurrentWorkshop() {
    currentWorkshop.value = getNewWorkshop();
  }

  function changeActiveWorkshop(w?: Workshop) {
    console.log(w);

    if (w) {
      activeId.value = w._id;
      currentWorkshop.value = { ...w };
      state.value = 'DETAILS';
    } else {
      activeId.value = null;
      clearCurrentWorkshop();
      state.value = 'NEW';
    }
  }

  return {
    workshops,
    currentWorkshop,

    activeId,
    activeWorkshop,

    state,
    loading,
    formDisabled,
    currentFormCardProps,

    init,
    upsert,
    remove,

    clearCurrentWorkshop,
    changeActiveWorkshop,
  };
});
