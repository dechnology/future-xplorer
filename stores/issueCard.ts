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
    const validationResult = NewIssueSchema.parse(currentIssue.value);

    console.log('Creating: ', validationResult);
    const createdIssue = await createIssue(token, workshopId, {
      ...validationResult,
    });

    return createdIssue;
  }

  async function edit(token: string, issueId: string): Promise<Issue> {
    loading.value = true;
    const validationResult = NewIssueSchema.parse(currentIssue.value);

    console.log('Patch: ', validationResult);
    const editedIssue = await updateIssue(token, issueId, currentIssue.value);

    console.log('Edited: ', editedIssue);
    loading.value = false;
    return editedIssue;
  }

  async function remove(token: string, issueId: string) {
    loading.value = true;
    const data = await deleteIssue(token, issueId);
    console.log(data);
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
