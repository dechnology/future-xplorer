import { Issue } from 'types/issue';

export const useActiveIssueStore = definePiniaStore('activeIssue', () => {
  const issue = ref<Issue | null>(null);
  return { issue };
});
