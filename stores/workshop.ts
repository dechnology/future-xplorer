import { Workshop, BaseIssue, NewIssue, FormStateKeys } from '@/types';

export const useWorkshopStore = definePiniaStore('workshop', () => {
  const workshop = ref<Workshop | null>(null);
  const workshopId = computed(() => workshop.value?._id);

  const issues = ref<BaseIssue[]>([]);
  const currentIssue = ref<NewIssue | BaseIssue>(getNewIssue());
  const activeIssue = ref<BaseIssue | null>(null);
  const activeId = computed(() => activeIssue.value?._id);

  const state = ref<FormStateKeys>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const currentFormCardProps = computed(() =>
    getCurrentFormCardProps(
      '議題',
      currentIssue.value as BaseIssue,
      state.value
    )
  );

  async function init(token: string, workshopId: string) {
    const [workshopResponse, issuesResponse] = await Promise.all([
      fetchResource<Workshop>(token, `/api/workshops/${workshopId}`),
      fetchResources<BaseIssue>(token, `/api/workshops/${workshopId}/issues`),
    ]);

    workshop.value = workshopResponse.data;
    issues.value = issuesResponse.data;
  }

  function upsert(i: BaseIssue) {
    const index = issues.value.findIndex((issue) => issue._id === i._id);
    if (index === -1) {
      issues.value.push(i);
    } else {
      issues.value[index] = i;
    }
  }

  function remove(id: string) {
    const index = issues.value.findIndex((issue) => issue._id === id);

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issues.value.splice(index, 1);
    }
  }

  function clearCurrentIssue() {
    currentIssue.value = getNewIssue();
  }

  function changeActiveIssue(i?: BaseIssue | null) {
    if (i) {
      activeIssue.value = { ...i };
      currentIssue.value = { ...i };
      state.value = 'DETAILS';
    } else {
      activeIssue.value = null;
      clearCurrentIssue();
      state.value = 'NEW';
    }
  }

  return {
    workshop,
    workshopId,

    issues,
    currentIssue,
    activeIssue,
    activeId,

    state,
    loading,
    formDisabled,
    currentFormCardProps,

    init,
    upsert,
    remove,

    clearCurrentIssue,
    changeActiveIssue,
  };
});
