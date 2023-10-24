import cloneDeep from 'lodash/cloneDeep';
import { getNewCase } from '~/utils';
import type {
  FormStateKey,
  Case,
  NewCase,
  Keyword,
  ImageStateKey,
} from '@/types';

export const useCaseStore = definePiniaStore('case', () => {
  const issueStore = useIssueStore();

  const searchQuery = ref<string>();
  const cases = ref<Case[]>([]);

  const currentCase = ref<Case | NewCase>(getNewCase());
  const activeCase = ref<Case | null>(null);
  const activeKeywords = computed((): Keyword[] =>
    activeCase.value ? activeCase.value.keywords : []
  );
  const activeId = computed(() => activeCase.value?._id);
  const imageUrl = ref<string | null>(null);
  const imageFile = ref<File | null>(null);

  const state = ref<FormStateKey>('NEW');
  const imageState = ref<ImageStateKey>('IDLE');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps('案例', currentCase.value as Case, state.value)
  );

  async function update(token: string) {
    if (!issueStore.issueId) {
      throw new Error('no issue id');
    }

    const { data } = await fetchResources<Case>(token, '/api/cases', {
      query: { issueId: issueStore.issueId, searchQuery: searchQuery.value },
    });

    cases.value = data;
  }

  async function init(token: string) {
    await update(token);
  }

  function resetForm() {
    state.value = activeCase.value ? 'DETAILS' : 'NEW';
    currentCase.value = activeCase.value
      ? cloneDeep(activeCase.value)
      : getNewCase();
  }

  function resetImage() {
    imageState.value =
      !activeCase.value || activeCase.value.image ? 'IDLE' : 'NONE';
    imageFile.value = null;
    imageUrl.value = null;
  }

  watch(activeCase, () => {
    resetForm();
    resetImage();
  });

  return {
    searchQuery,
    cases,
    currentCase,
    activeCase,
    activeKeywords,
    activeId,

    imageUrl,
    imageFile,

    state,
    imageState,
    loading,
    formDisabled,
    formCardProps,

    update,
    init,
    resetForm,
    resetImage,
  };
});
