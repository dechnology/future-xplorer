import { getNewCase } from '~/utils';
import { FormStateKeys, Case, NewCase } from '@/types';

export const useCaseStore = definePiniaStore('case', () => {
  const currentCase = ref<Case | NewCase>(getNewCase());
  const activeCase = ref<Case | null>(null);
  const activeId = computed(() => activeCase.value?._id);
  const imageUrlBuffer = ref<string | null>(null);
  const imageFileBuffer = ref<File | null>(null);

  const state = ref<FormStateKeys>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps('案例', currentCase.value as Case, state.value)
  );

  function clearCurrentCase() {
    currentCase.value = getNewCase();
  }

  function changeActiveCase(p?: Case | null) {
    if (p) {
      activeCase.value = { ...p };
      currentCase.value = { ...p };
      state.value = 'DETAILS';
    } else {
      activeCase.value = null;
      clearCurrentCase();
      state.value = 'NEW';
    }
  }

  return {
    currentCase,
    activeCase,
    activeId,

    imageUrlBuffer,
    imageFileBuffer,

    state,
    loading,
    formDisabled,
    formCardProps,

    clearCurrentCase,
    changeActiveCase,
  };
});
