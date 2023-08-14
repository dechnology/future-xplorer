import { Workshop } from '@/types/workshop';
import { BaseIssue } from '@/types/issue';

export const useIssuesStore = definePiniaStore('issues', () => {
  const workshop = ref<Workshop | null>(null);
  const issues = ref<BaseIssue[]>([]);

  async function init(token: string, workshopId: string) {
    const workshopData = await fetchWorkshop(token, workshopId);
    const issuesData = await fetchWorkshopIssues(token, workshopId);

    workshop.value = workshopData.workshop;
    issues.value = issuesData.issues;

    console.log('workshop: ', workshop.value);
    console.log('issues: ', issues.value);
  }

  return { workshop, issues, init };
});
