import cloneDeep from 'lodash/cloneDeep';
import { Workshop, BaseIssue, NewIssue, FormStateKey } from '@/types';

export const useWorkshopStore = definePiniaStore('workshop', () => {
  const workshop = ref<Workshop | null>(null);
  const workshopId = computed(() => workshop.value?._id);

  const searchQuery = ref<string>('');
  const issues = ref<BaseIssue[]>([]);
  const currentIssue = ref<NewIssue | BaseIssue>(getNewIssue());
  const activeIssue = ref<BaseIssue | null>(null);
  const activeId = computed(() => activeIssue.value?._id);

  const state = ref<FormStateKey>('NEW');
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

  async function updateIssues(token: string) {
    if (!workshopId.value) {
      throw new Error('no workshop id');
    }

    const { data } = await fetchResources<BaseIssue>(token, `/api/issues`, {
      query: { workshopId: workshopId.value, searchQuery: searchQuery.value },
    });

    issues.value = data;
  }

  async function init(token: string, workshopId: string) {
    const [workshopResponse, issuesResponse] = await Promise.all([
      fetchResource<Workshop>(token, `/api/workshops/${workshopId}`),
      fetchResources<BaseIssue>(token, `/api/workshops/${workshopId}/issues`),
    ]);

    workshop.value = workshopResponse.data;
    issues.value = issuesResponse.data;
  }

  function clearCurrentIssue() {
    currentIssue.value = getNewIssue();
  }

  function changeActiveIssue(el?: BaseIssue | null) {
    if (el) {
      activeIssue.value = el;
      currentIssue.value = cloneDeep(el);
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

    searchQuery,
    issues,
    currentIssue,
    activeIssue,
    activeId,

    state,
    loading,
    formDisabled,
    currentFormCardProps,

    init,
    updateIssues,

    clearCurrentIssue,
    changeActiveIssue,
  };
});
