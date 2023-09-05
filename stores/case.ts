import { getNewCase } from '~/utils';
import {
  FormStateKeys,
  Case,
  NewCase,
  Keyword,
  NewKeyword,
  NewKeywordSchema,
} from '@/types';
import { z } from 'zod';

export const useCaseStore = definePiniaStore('case', () => {
  const currentCase = ref<Case | NewCase>(getNewCase());
  const activeCase = ref<Case | null>(null);
  const activeKeywords = computed((): Keyword[] =>
    activeCase.value ? activeCase.value.keywords : []
  );
  const activeId = computed(() => activeCase.value?._id);
  const imageUrlBuffer = ref<string | null>(null);
  const imageFileBuffer = ref<File | null>(null);

  const newKeywords = ref<NewKeyword[]>([]);
  const currentKeywords = ref<Keyword[]>([]);

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

  function changeActiveCase(c?: Case | null) {
    if (c) {
      activeCase.value = { ...c };
      currentCase.value = { ...c };
      currentKeywords.value = [...c.keywords];
      state.value = 'DETAILS';
    } else {
      activeCase.value = null;
      clearCurrentCase();
      currentKeywords.value = [];
      state.value = 'NEW';
    }
  }

  return {
    currentCase,
    activeCase,
    activeKeywords,
    activeId,

    imageUrlBuffer,
    imageFileBuffer,

    newKeywords,
    currentKeywords,

    state,
    loading,
    formDisabled,
    formCardProps,

    clearCurrentCase,
    changeActiveCase,
  };
});
