import type { Workshop, Issue, IssueTab, WorkshopElement } from '@/types';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
  const workshopId = computed(() => workshop.value?._id);
  const elements = computed(() => {
    if (workshop.value) {
      const { objects, environments, messages, services } = workshop.value;
      return {
        objects,
        environments,
        messages,
        services,
      };
    }
  });
  const elementsArray = computed(() =>
    elements.value
      ? [
          ...elements.value.objects.map(
            (el): WorkshopElement => ({
              type: 'O',
              name: el,
            })
          ),
          ...elements.value.environments.map(
            (el): WorkshopElement => ({
              type: 'E',
              name: el,
            })
          ),
          ...elements.value.messages.map(
            (el): WorkshopElement => ({
              type: 'M',
              name: el,
            })
          ),
          ...elements.value.services.map(
            (el): WorkshopElement => ({
              type: 'S',
              name: el,
            })
          ),
        ]
      : []
  );

  const issue = ref<Issue | null>(null);
  const issueId = computed(() => issue.value?._id);
  const currentTab = ref<IssueTab>(readCurrentTab());

  const loading = ref(false);

  async function updateWorkshop(token: string) {
    if (!workshopId.value) {
      throw new Error('no workshop id');
    }

    const { data } = await fetchResource<Workshop>(
      token,
      `/api/workshops/${workshopId.value}`
    );

    workshop.value = data;
  }

  async function updateIssue(token: string) {
    if (!issueId.value) {
      throw new Error('no issue id');
    }

    const { data } = await fetchResource<Issue>(
      token,
      `/api/issues/${issueId.value}`,
      { deserializer: deserializeIssue }
    );

    issue.value = data;
  }

  async function init(token: string, workshopId: string, issueId: string) {
    const [workshopResponse, issuesResponse] = await Promise.all([
      fetchResource<Workshop>(token, `/api/workshops/${workshopId}`),
      fetchResource<Issue>(token, `/api/issues/${issueId}`, {
        deserializer: deserializeIssue,
      }),
    ]);

    workshop.value = workshopResponse.data;
    issue.value = issuesResponse.data;
  }

  function setTab(t: IssueTab) {
    currentTab.value = t;
    localStorage.setItem('tab', t.name);
  }

  return {
    workshop,
    workshopId,
    elements,
    elementsArray,

    issue,
    issueId,
    currentTab,
    loading,

    updateWorkshop,
    updateIssue,
    init,
    setTab,
  };
});
