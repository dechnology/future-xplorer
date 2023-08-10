import { Workshop } from '@/types/workshop';
import { BaseIssue } from '@/types/issue';

export const useIssuesStore = definePiniaStore('issues', () => {
  const workshop = ref<Workshop | null>(null);
  const issues = ref<BaseIssue[] | null>(null);

  async function init(workshopId: string) {
    const data = await fetchWorkshopById(workshopId);

    workshop.value = data.workshop;
    issues.value = data.workshop.issues;
  }

  return { workshop, issues, init };
});
