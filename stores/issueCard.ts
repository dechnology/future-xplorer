import { BaseIssue, NewIssue, NewIssueSchema } from '@/types/issue';
import { CardState, CardStates } from '@/types/cardState';

const getNewIssue = (): NewIssue => ({
  title: '',
  description: '',
});

export const useIssueCardStore = definePiniaStore('issue card', () => {
  const currentIssue = ref<BaseIssue | NewIssue>(getNewIssue());
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);

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

  async function edit(token: string) {}

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
  };
});
