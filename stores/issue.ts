import { Workshop } from './../types/workshop';
import { Issue, IssueState, IssueStates } from '@/types/issue';

export const useIssueStore = definePiniaStore('issue', () => {
  // fetched
  const workshop = ref<Workshop | null>(null);
  const issue = ref<Issue | null>(null);

  async function initStore(workshopId: number, issueId: number) {}

  return { initStore };
});
