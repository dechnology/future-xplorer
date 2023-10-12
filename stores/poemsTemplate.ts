import { fakerZH_TW } from '@faker-js/faker';
import { getNewPoemsTemplate } from '@/utils';
import type {
  FormStateKey,
  PoemsTemplate,
  NewPoemsTemplate,
  SelectOption,
  Persona,
} from '@/types';

export const usePoemsTemplateStore = definePiniaStore('poems template', () => {
  const issueStore = useIssueStore();
  const personaStore = usePersonaStore();
  const keywordStore = useKeywordStore();

  console.log(issueStore.issue?.poemsTemplates);

  const poemsTemplates = computed((): PoemsTemplate[] =>
    issueStore.issue ? issueStore.issue.poemsTemplates : []
  );

  const currentPoemsTemplate = ref<PoemsTemplate | NewPoemsTemplate>(
    getNewPoemsTemplate()
  );
  const activePoemsTemplate = ref<PoemsTemplate | null>(null);
  const activeId = computed(() => activePoemsTemplate.value?._id);

  const state = ref<FormStateKey>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps(
      'POEMS模板',
      currentPoemsTemplate.value as PoemsTemplate,
      state.value
    )
  );

  const personaOptions = computed((): SelectOption<Persona>[] =>
    personaStore.personas.map((el) => ({
      name: `${el.trait}的${el.role}(${el.name})`,
      data: el,
    }))
  );

  const keywordOptions = computed(() => {
    const results: Record<'O' | 'E' | 'M' | 'S', SelectOption<string>[]> = {
      O: [],
      E: [],
      M: [],
      S: [],
    };
    keywordStore.votedKeywords.forEach((el) => {
      el.type &&
        results[el.type].push({
          name: el.body,
          data: el.body,
        });
    });
    return results;
  });

  function upsertPoemsTemplate(el: PoemsTemplate) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.poemsTemplates.findIndex(
      (persona) => persona._id === el._id
    );

    if (index === -1) {
      issueStore.issue.poemsTemplates.push(el);
    } else {
      issueStore.issue.poemsTemplates[index] = el;
    }
  }

  function removePoemsTemplate(id: string) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.poemsTemplates.findIndex(
      (persona) => persona._id === id
    );

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issueStore.issue.poemsTemplates.splice(index, 1);
    }
  }

  function clearCurrentPoemsTemplate() {
    currentPoemsTemplate.value = getNewPoemsTemplate();
  }

  function changeActivePoemsTemplate(p?: PoemsTemplate | null) {
    if (p) {
      activePoemsTemplate.value = { ...p };
      currentPoemsTemplate.value = { ...p };
      state.value = 'DETAILS';
    } else {
      activePoemsTemplate.value = null;
      clearCurrentPoemsTemplate();
      state.value = 'NEW';
    }
  }

  function getRandomContext() {
    return {
      persona: fakerZH_TW.helpers.arrayElement(
        personaOptions.value.map((el) => el.data)
      ),
      object: fakerZH_TW.helpers.arrayElement(
        keywordOptions.value.O.map((el) => el.data)
      ),
      environment: fakerZH_TW.helpers.arrayElement(
        keywordOptions.value.E.map((el) => el.data)
      ),
      message: fakerZH_TW.helpers.arrayElement(
        keywordOptions.value.M.map((el) => el.data)
      ),
      service: fakerZH_TW.helpers.arrayElement(
        keywordOptions.value.S.map((el) => el.data)
      ),
    };
  }

  function randomizeContext() {
    currentPoemsTemplate.value = {
      ...currentPoemsTemplate.value,
      ...getRandomContext(),
    };
  }

  return {
    poemsTemplates,
    currentPoemsTemplate,
    activePoemsTemplate,
    activeId,

    state,
    loading,
    formDisabled,
    formCardProps,
    personaOptions,
    keywordOptions,

    upsertPoemsTemplate,
    removePoemsTemplate,
    clearCurrentPoemsTemplate,
    changeActivePoemsTemplate,
    getRandomContext,
    randomizeContext,
  };
});
