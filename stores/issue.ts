import { Character } from 'types/character';
import { Workshop } from '@/types/workshop';
import { Issue } from '@/types/issue';
import { Case } from '@/types/case';
import { Keyword } from '@/types/keyword';

export const useIssueStore = definePiniaStore('issue', () => {
  const workshop = ref<BaseWorkshop | null>(null);
  const issue = ref<Issue | null>(null);

  const elements = computed(
    () => workshop.value?.elements as WorkshopElement[]
  );
  const characters = computed(() => issue.value?.charaters as Character[]);
  const cases = computed(() => issue.value?.cases as Case[]);
  const keywords = computed(() => issue.value?.keywords as Keyword[]);

  function updateKeywordById(id: string, k: Keyword) {
    if (!(issue.value && issue.value.keywords)) {
      return;
    }

    const idx = issue.value?.keywords.findIndex((k) => k.id === id);
    issue.value.keywords[idx] = { ...k };
  }

  async function init(token: string, workshopId: string, issueId: string) {
    const data = await fetchWorkshop(token, workshopId);
    const data = await fetchWorkshopIssue(token, workshopId, issueId);

    workshop.value = data.workshop;
    issue.value = data.issue;
  }

  return {
    workshop,
    elements,
    issue,
    characters,
    cases,
    keywords,
    init,
    updateKeywordById,
  };
});
