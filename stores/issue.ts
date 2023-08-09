import { Character } from 'types/character';
import { Workshop } from '@/types/workshop';
import { Issue } from '@/types/issue';
import { Case } from '@/types/case';
import { Keyword } from '@/types/keyword';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<Workshop | null>(null);
  const issue = ref<Issue | null>(null);

  const charaters = computed(() => issue.value?.charaters as Character[]);
  const cases = computed(() => issue.value?.cases as Case[]);
  const keywords = computed(() => issue.value?.keywords as Keyword[]);

  async function init(workshopId: string, issueId: string) {
    const data = await fetchIssueById(workshopId, issueId, {
      withWorkshop: true,
    });

    workshop.value = data.workshop as Workshop;
    issue.value = data.issue;
  }

  return { workshop, issue, charaters, cases, keywords, init };
});
