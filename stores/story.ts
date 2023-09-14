import { FormStateKeys, Story, NewStory } from '@/types';

export const useStoryStore = definePiniaStore('story', () => {
  const issueStore = useIssueStore();

  const stories = computed((): Story[] =>
    issueStore.issue ? issueStore.issue.stories : []
  );

  const currentStory = ref<Story | NewStory>(getNewStory());
  const activeStory = ref<Story | null>(null);
  const activeId = computed(() => activeStory.value?._id);

  const state = ref<FormStateKeys>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps('故事', currentStory.value as Story, state.value)
  );

  function upsertStory(el: Story) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.stories.findIndex(
      (persona) => persona._id === el._id
    );

    if (index === -1) {
      issueStore.issue.stories.push(el);
    } else {
      issueStore.issue.stories[index] = el;
    }
  }

  function removeStory(id: string) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.stories.findIndex(
      (persona) => persona._id === id
    );

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issueStore.issue.stories.splice(index, 1);
    }
  }

  function clearCurrentStory() {
    currentStory.value = getNewStory();
  }

  function changeActiveStory(p?: Story | null) {
    if (p) {
      activeStory.value = { ...p };
      currentStory.value = { ...p };
      state.value = 'DETAILS';
    } else {
      activeStory.value = null;
      clearCurrentStory();
      state.value = 'NEW';
    }
  }

  return {
    stories,
    currentStory,
    activeStory,
    activeId,

    state,
    loading,
    formDisabled,
    formCardProps,

    upsertStory,
    removeStory,
    clearCurrentStory,
    changeActiveStory,
  };
});
