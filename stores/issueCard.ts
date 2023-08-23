import type { BaseIssue, NewIssue, CardState, Persona, Issue } from '@/types';
import { CardStates, NewIssueSchema } from '@/types';

const getNewIssue = (): NewIssue => ({
  title: '',
  description: '',
});

export const useIssueCardStore = definePiniaStore('issue card', () => {
  const currentIssue = ref<BaseIssue | NewIssue>(getNewIssue());
  const activeIssue = ref<BaseIssue | null>(null);
  const state = ref<CardState>(CardStates.New);
  const loading = ref(false);

  const activeId = computed(
    (): string | null => activeIssue.value && activeIssue.value._id
  );

  function clearCurrentIssue() {
    currentIssue.value = getNewIssue();
  }

  function clearActiveIssue() {
    activeIssue.value = null;
  }

  function setCurrentIssue(i: BaseIssue) {
    currentIssue.value = { ...i };
  }

  function setActiveIssue(i: BaseIssue) {
    activeIssue.value = i;
  }

  async function submit(token: string, workshopId: string): Promise<BaseIssue> {
    loading.value = true;
    const i = NewIssueSchema.parse(currentIssue.value);

    console.log('Creating: ', i);
    const { data } = await fetchResource<BaseIssue>(
      token,
      `/api/workshops/${workshopId}/issues`,
      {
        method: 'post',
        body: i,
      }
    );
    console.log('Created:', data);

    loading.value = false;
    return data;
  }

  async function edit(token: string, issueId: string): Promise<BaseIssue> {
    loading.value = true;
    const i = NewIssueSchema.parse(currentIssue.value);

    console.log('Patch: ', i);
    const { data } = await fetchResource<BaseIssue>(
      token,
      `/api/issues/${issueId}`,
      {
        method: 'put',
        body: i,
      }
    );

    console.log('Edited: ', data);
    loading.value = false;
    return data;
  }

  async function remove(token: string, issueId: string) {
    loading.value = true;

    const { message } = await fetchResource<BaseIssue>(
      token,
      `/api/issues/${issueId}`,
      {
        method: 'delete',
      }
    );

    console.log(message);
    loading.value = false;
  }

  watch(state, (newState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveIssue();
      clearCurrentIssue();
    }
  });

  return {
    currentIssue,
    activeIssue,
    activeId,
    state,

    clearCurrentIssue,
    setCurrentIssue,
    clearActiveIssue,
    setActiveIssue,

    submit,
    edit,
    remove,
  };
});
