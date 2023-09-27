import cloneDeep from 'lodash/cloneDeep';
import type {
  FormStateKeys,
  Story,
  NewStory,
  PoemsTemplate,
  SelectOption,
  User,
} from '@/types';

export const useStoryStore = definePiniaStore('story', () => {
  const authStore = useAuthStore();
  const issueStore = useIssueStore();
  const poemsTemplateStore = usePoemsTemplateStore();

  const stories = computed((): Story[] =>
    issueStore.issue ? issueStore.issue.stories : []
  );

  const currentStories = ref<(Story | NewStory)[]>([getNewStory()]);
  const currentStory = computed(
    (): Story | NewStory => currentStories.value[0]
  );
  const activeStories = ref<Story[]>([]);
  const activeIds = computed(() => activeStories.value.map((el) => el._id));
  const activeId = computed(() => activeIds.value[0]);

  const state = ref<FormStateKeys>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps(
      '故事',
      activeStories.value.length === 1
        ? (currentStories.value[0] as Story)
        : { creator: authStore.user as User },
      state.value
    )
  );

  const poemsTemplateOptions = computed((): SelectOption<PoemsTemplate>[] =>
    poemsTemplateStore.poemsTemplates.map((el) => ({
      name: el.title,
      data: el,
    }))
  );

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

  function clearCurrentStories() {
    currentStories.value = [getNewStory()];
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

  watchDeep(activeStories, (newActiveStories) => {
    if (newActiveStories.length === 0) {
      state.value = 'NEW';
      clearCurrentStories();
    } else if (newActiveStories.length === 1) {
      state.value = 'DETAILS';
      currentStories.value = [cloneDeep(newActiveStories[0])];
    } else {
      state.value = 'MULTIPLE';
      currentStories.value = cloneDeep(newActiveStories);
    }
  });

  return {
    stories,
    currentStories,
    currentStory,
    activeStories,
    activeIds,
    activeId,

    state,
    loading,
    formDisabled,
    formCardProps,
    poemsTemplateOptions,

    upsertStory,
    removeStory,
    clearCurrentStories,
    clearActiveStories,
    toggleActiveStory,
  };
});
