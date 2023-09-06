import { Persona, Workshop, Issue, Case, IssueTabs, IssueTab } from '@/types';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
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
          ...elements.value.objects,
          ...elements.value.environments,
          ...elements.value.messages,
          ...elements.value.services,
        ]
      : []
  );

  const issue = ref<Issue | null>(null);
  const issueId = computed(() => issue.value?._id);
  const currentTab = ref<IssueTab>(IssueTabs.persona);

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
  return {
    workshop,
    elements,
    elementsArray,

    issue,
    issueId,
    currentTab,

    init,
  };
});
