import type { BaseIssue, NewIssue, CardState, Persona, Issue } from '@/types';
import { CardStates, NewIssueSchema } from '@/types';

const getNewIssue = (): NewIssue => ({
  title: '',
  description: '',
});

export const useIssueCardStore = definePiniaStore('issue card', () => {
  const currentIssue = ref<BaseIssue | NewIssue>(getNewIssue());
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);
  const loading = ref(false);

  function clearCurrentIssue() {
    currentIssue.value = getNewIssue();
  }

  function clearActiveId() {
    activeId.value = null;
  }

  function setCurrentIssue(i: BaseIssue) {
    currentIssue.value = { ...i };
  }

  function setActiveId(id: string) {
    activeId.value = id;
  }

  async function submit(token: string, workshopId: string): Promise<BaseIssue> {
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
      clearActiveId();
      clearCurrentIssue();
    }
  });

  return {
    activeId,
    currentIssue,
    state,

    clearCurrentIssue,
    setCurrentIssue,
    clearActiveId,
    setActiveId,

    submit,
    edit,
    remove,
  };
});
