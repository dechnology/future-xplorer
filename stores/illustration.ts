import type { Illustration, NewIllustration } from '@/types';

export const useIllustrationStore = definePiniaStore('illustration', () => {
  const issueStore = useIssueStore();

  const illustrations = computed((): Illustration[] =>
    issueStore.issue ? issueStore.issue.illustrations : []
  );

  const currentIllustration = ref<Illustration | NewIllustration>(
    getNewIllustration()
  );
  const activeIllustration = ref<Illustration | null>(null);
  const activeId = computed(() => activeIllustration.value?._id);

  const loading = ref(false);
  const formDisabled = computed(() => loading.value);

  function upsertIllustration(el: Illustration) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.illustrations.findIndex(
      (illustration) => illustration._id === el._id
    );

    if (index === -1) {
      issueStore.issue.illustrations.push(el);
    } else {
      issueStore.issue.illustrations[index] = el;
    }
  }

  function removeIllustration(id: string) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.illustrations.findIndex(
      (illustration) => illustration._id === id
    );

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issueStore.issue.illustrations.splice(index, 1);
    }
  }

  function clearCurrentIllustration() {
    currentIllustration.value = getNewIllustration();
  }

  function changeActiveIllustration(p?: Illustration | null) {
    if (p) {
      activeIllustration.value = { ...p };
      currentIllustration.value = { ...p };
    } else {
      activeIllustration.value = null;
      clearCurrentIllustration();
    }
  }

  return {
    illustrations,
    currentIllustration,
    activeIllustration,
    activeId,

    loading,
    formDisabled,

    upsertIllustration,
    removeIllustration,
    clearCurrentIllustration,
    changeActiveIllustration,
  };
});
