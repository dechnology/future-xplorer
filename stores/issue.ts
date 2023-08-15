import { Persona } from '@/types/persona';
import { Workshop } from '@/types/workshop';
import { Issue } from '@/types/issue';
import { Case } from '@/types/case';
import { Keyword } from '@/types/keyword';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
  const issue = ref<Issue | null>(null);

  const personas = computed(
    () => issue.value && (issue.value.personas as Persona[])
  );

  async function init(token: string, workshopId: string, issueId: string) {
    const results = await Promise.allSettled([
      fetchWorkshop(token, workshopId),
      fetchWorkshopIssue(token, workshopId, issueId),
    ]);

    const workshopResult = results[0];
    if (workshopResult.status === 'fulfilled') {
      workshop.value = workshopResult.value.workshop;
    } else {
      console.error('Error fetching workshop:', workshopResult.reason);
      // Handle the workshop fetch error
    }

    const issueResult = results[1];
    if (issueResult.status === 'fulfilled') {
      issue.value = issueResult.value.issue;
    } else {
      console.error('Error fetching issues:', issueResult.reason);
      // Handle the issues fetch error
    }
  }

  return {
    workshop,
    issue,
    personas,
    init,
  };
});
