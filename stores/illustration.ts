import cloneDeep from 'lodash/cloneDeep';
import type { Illustration, NewIllustration } from '@/types';

export const useIllustrationStore = definePiniaStore('illustration', () => {
  const issueStore = useIssueStore();

  const searchQuery = ref<string>('');
  const illustrations = ref<Illustration[]>([]);

  const currentIllustration = ref<Illustration | NewIllustration>(
    getNewIllustration()
  );
  const activeIllustration = ref<Illustration | null>(null);
  const activeId = computed(() => activeIllustration.value?._id);

  const loading = ref(false);
  const formDisabled = computed(() => loading.value);

  function clearCurrentIllustration() {
    currentIllustration.value = getNewIllustration();
  }

  async function update(token: string) {
    if (!issueStore.issueId) {
      throw new Error('no issue id');
    }

    const { data } = await fetchResources<Illustration>(
      token,
      '/api/illustrations',
      {
        query: {
          issueId: issueStore.issueId,
          searchQuery: searchQuery.value,
        },
      }
    );

    illustrations.value = data;
  }

  async function init(token: string) {
    await update(token);
  }

  function resetForm() {
    currentIllustration.value = activeIllustration.value
      ? cloneDeep(activeIllustration.value)
      : getNewIllustration();
  }

  watch(activeIllustration, () => {
    resetForm();
  });

  return {
    searchQuery,
    illustrations,
    currentIllustration,
    activeIllustration,
    activeId,

    loading,
    formDisabled,

    init,
    update,
    clearCurrentIllustration,
  };
});
