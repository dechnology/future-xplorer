import { Character } from 'types/character';
import { Workshop } from '@/types/workshop';
import { Issue } from '@/types/issue';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
  const issue = ref<Issue | null>(null);

  const charaters = computed(() =>
    issue.value !== null ? (issue.value.charaters as Character[]) : null
  );

  async function initStore(workshopId: string, issueId: string) {
    const data = await fetchIssueById(workshopId, issueId, {
      withWorkshop: true,
    });

    workshop.value = data.workshop as Workshop;
    issue.value = data.issue;
  }

  return { workshop, issue, charaters, initStore };
});
