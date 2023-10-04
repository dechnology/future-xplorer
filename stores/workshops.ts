import cloneDeep from 'lodash/cloneDeep';
import { FormStateKeys } from '@/types';
import type { NewWorkshop, Workshop } from '@/types';
import { getCurrentFormCardProps, getNewWorkshop } from '~/utils/form';

export const useWorkshopsStore = definePiniaStore('workshops', () => {
  const workshops = ref<Workshop[]>([]);
  const currentWorkshop = ref<NewWorkshop | Workshop>(getNewWorkshop());

  const activeWorkshop = ref<Workshop | null>(null);
  const activeId = computed(() => activeWorkshop.value?._id);

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

  async function update(token: string) {
    const { data } = await fetchResources<Workshop>(token, '/api/workshops');
    workshops.value = data;
  }

  async function init(token: string) {
    await update(token);
  }

  function clearCurrentWorkshop() {
    currentWorkshop.value = getNewWorkshop();
  }

  function changeActiveWorkshop(el?: Workshop | null) {
    if (el) {
      activeWorkshop.value = el;
      currentWorkshop.value = cloneDeep(el);
      state.value = 'DETAILS';
    } else {
      activeWorkshop.value = null;
      clearCurrentWorkshop();
      state.value = 'NEW';
    }
  }

  return {
    workshops,
    currentWorkshop,
    activeWorkshop,
    activeId,

    state,
    loading,
    formDisabled,
    currentFormCardProps,

    update,
    init,

    clearCurrentWorkshop,
    changeActiveWorkshop,
  };
});
