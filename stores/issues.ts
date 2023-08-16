import { Workshop } from '@/types/workshop';
import { BaseIssue } from '@/types/issue';

export const useIssuesStore = definePiniaStore('issues', () => {
  const workshop = ref<Workshop | null>(null);
  const issues = ref<BaseIssue[]>([]);

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

  function findById(id: string): BaseIssue | null {
    const index = issues.value.findIndex((issue) => issue._id === id);

    return index === -1 ? null : issues.value[index];
  }

  function upsert(w: BaseIssue) {
    const index = issues.value.findIndex((issue) => issue._id === w._id);
    if (index === -1) {
      issues.value.push(w);
    } else {
      issues.value[index] = w;
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

  return { workshop, issues, init, findById, upsert, remove };
});
