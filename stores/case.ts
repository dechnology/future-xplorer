import cloneDeep from 'lodash/cloneDeep';
import { getNewCase } from '~/utils';
import { FormStateKey, Case, NewCase, Keyword, NewKeyword } from '@/types';

export const useCaseStore = definePiniaStore('case', () => {
  const issueStore = useIssueStore();

  const cases = computed((): Case[] =>
    issueStore.issue ? issueStore.issue.cases : []
  );

  const currentCase = ref<Case | NewCase>(getNewCase());
  const activeCase = ref<Case | null>(null);
  const activeKeywords = computed((): Keyword[] =>
    activeCase.value ? activeCase.value.keywords : []
  );
  const activeId = computed(() => activeCase.value?._id);
  const imageUrlBuffer = ref<string | null>(null);
  const imageFileBuffer = ref<File | null>(null);

  const currentKeywords = ref<Keyword[]>([]);

  const state = ref<FormStateKey>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps('案例', currentCase.value as Case, state.value)
  );

  function upsertCase(el: Case) {
    if (!issueStore.issue) {
      return;
    }

    const index = cases.value.findIndex((c) => c._id === el._id);

    if (index === -1) {
      issueStore.issue.cases.push(el);
    } else {
      issueStore.issue.cases[index] = el;
    }
  }

  function removeCase(id: string) {
    if (!issueStore.issue) {
      return;
    }

    const index = cases.value.findIndex((c) => c._id === id);

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issueStore.issue.cases.splice(index, 1);
    }
  }

  function clearCurrentCase() {
    currentCase.value = getNewCase();
    imageUrlBuffer.value = null;
  }

  function changeActiveCase(c?: Case | null) {
    if (c) {
      activeCase.value = c;
      currentCase.value = cloneDeep(c);
      currentKeywords.value = cloneDeep(c.keywords);
      state.value = 'DETAILS';
    } else {
      activeCase.value = null;
      clearCurrentCase();
      currentKeywords.value = [];
      state.value = 'NEW';
    }
  }

  return {
    cases,
    currentCase,
    activeCase,
    activeKeywords,
    activeId,

    imageUrlBuffer,
    imageFileBuffer,

    currentKeywords,

    state,
    loading,
    formDisabled,
    formCardProps,

    upsertCase,
    removeCase,
    clearCurrentCase,
    changeActiveCase,
  };
});
