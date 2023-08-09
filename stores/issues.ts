import { NewWorkshop, Workshop } from '@/types/workshop';
import { Issue, NewIssue } from '@/types/issue';

const newWorkshop = {
  name: '',
  description: '',

  elements: [
    { name: '技術', category: 'object' },
    { name: '場景體驗', category: 'environment' },
    { name: '洞見與價值', category: 'message' },
    { name: '使用者體驗', category: 'service' },
  ],
} as NewWorkshop;

export const useIssuesStore = definePiniaStore('issues', () => {
  const workshop = ref<Workshop | null>(null);
  const issues = ref<Issue[] | null>(null);

  async function init(workshopId: string) {
    const data = (await fetchWorkshopById(workshopId, {
      withIssues: true,
    })) as { workshop: Workshop; issues: Issue[] };

    workshop.value = data.workshop;
    issues.value = data.issues;
  }

  return { workshop, issues, init };
});
