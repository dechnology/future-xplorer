import { Workshop } from '@/types/workshop';
import { BaseIssue } from '@/types/issue';

export const useIssuesStore = definePiniaStore('issues', () => {
  const workshop = ref<Workshop | null>(null);
  const issues = ref<BaseIssue[]>([]);

  function push(i: BaseIssue) {
    issues.value.push({ ...i });
  }

  async function init(token: string, workshopId: string) {
    const results = await Promise.allSettled([
      fetchWorkshop(token, workshopId),
      fetchWorkshopIssues(token, workshopId),
    ]);

    const workshopResult = results[0];
    if (workshopResult.status === 'fulfilled') {
      workshop.value = workshopResult.value.workshop;
    } else {
      console.error('Error fetching workshop:', workshopResult.reason);
      // Handle the workshop fetch error
    }

    const issuesResult = results[1];
    if (issuesResult.status === 'fulfilled') {
      issues.value = issuesResult.value.issues;
    } else {
      console.error('Error fetching issues:', issuesResult.reason);
      // Handle the issues fetch error
    }
  }

  return { workshop, issues, push, init };
});
