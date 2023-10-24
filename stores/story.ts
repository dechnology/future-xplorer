import cloneDeep from 'lodash/cloneDeep';
import type {
  FormStateKey,
  Story,
  NewStory,
  PoemsTemplate,
  SelectOption,
  StoryContext,
} from '@/types';

export const useStoryStore = definePiniaStore('story', () => {
  const issueStore = useIssueStore();
  const poemsTemplateStore = usePoemsTemplateStore();

  const searchQuery = ref<string>();
  const stories = ref<Story[]>([]);

  const currentStory = ref<Story | NewStory>(getNewStory());
  const currentContext = ref<StoryContext>(getNewStoryContext());
  const activeStories = ref<Story[]>([]);
  const activeIds = computed(() => activeStories.value.map((el) => el._id));
  const activeId = computed(() => activeIds.value[0]);

  const state = ref<FormStateKey>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps('故事', currentStory.value as Story, state.value)
  );

  const poemsTemplateOptions = computed((): SelectOption<PoemsTemplate>[] =>
    poemsTemplateStore.poemsTemplates.map((el) => ({
      name: el.title,
      data: el,
    }))
  );

  async function update(token: string) {
    if (!issueStore.issueId) {
      throw new Error('no issue id');
    }

    const { data } = await fetchResources<Story>(token, '/api/stories', {
      query: { issueId: issueStore.issueId, searchQuery: searchQuery.value },
    });

    stories.value = data;
  }

  async function init(token: string) {
    await update(token);
  }

  function upsertStory(el: Story) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.stories.findIndex(
      (story) => story._id === el._id
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
      (story) => story._id === id
    );

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issueStore.issue.stories.splice(index, 1);
    }
  }

  function clearCurrent() {
    currentStory.value = getNewStory();
    currentContext.value = getNewStoryContext();
  }

  function toggleActiveStory(story: Story) {
    if (activeIds.value.includes(story._id)) {
      const index = activeStories.value.findIndex((el) => el._id === story._id);
      if (index === -1) {
        throw new Error('no story match given id');
      }
      activeStories.value.splice(index, 1);
    } else {
      activeStories.value.push(story);
    }
  }

  function clearActiveStories() {
    activeStories.value = [];
  }

  function resetForm() {
    const nActiveStories = activeStories.value.length;

    if (nActiveStories === 0) {
      state.value = 'NEW';
      clearCurrent();
    } else if (nActiveStories === 1) {
      state.value = 'DETAILS';
      currentStory.value = cloneDeep(activeStories.value[0]);
    } else {
      state.value = 'MULTIPLE';
    }
  }

  watchDeep(activeStories, (newActiveStories) => {
    if (newActiveStories.length === 0) {
      state.value = 'NEW';
      clearCurrent();
    } else if (newActiveStories.length === 1) {
      state.value = 'DETAILS';
      currentStory.value = cloneDeep(newActiveStories[0]);
    } else {
      state.value = 'MULTIPLE';
    }
  });

  return {
    stories,
    currentStory,
    currentContext,
    activeStories,
    activeIds,
    activeId,

    state,
    loading,
    formDisabled,
    formCardProps,
    poemsTemplateOptions,

    init,
    update,
    upsertStory,
    removeStory,
    clearCurrent,
    clearActiveStories,
    toggleActiveStory,
    resetForm,
  };
});
