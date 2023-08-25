import { Workshop, BaseIssue } from '@/types';

export const useWorkshopStore = definePiniaStore('workshop', () => {
  const workshop = ref<Workshop | null>(null);
  const issues = ref<BaseIssue[]>([]);

  async function init(token: string, workshopId: string) {
    const [workshopResponse, issuesResponse] = await Promise.all([
      fetchResource<Workshop>(token, `/api/workshops/${workshopId}`),
      fetchResources<BaseIssue>(token, `/api/workshops/${workshopId}/issues`),
    ]);

    workshop.value = workshopResponse.data;
    issues.value = issuesResponse.data;
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
