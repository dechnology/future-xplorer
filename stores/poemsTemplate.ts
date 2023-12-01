import cloneDeep from 'lodash/cloneDeep';
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

  const searchQuery = ref<string>('');
  const poemsTemplates = ref<PoemsTemplate[]>([]);

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
    keywordStore.keywords
      .filter((el) => el.votes.length > 0)
      .forEach((el) => {
        el.type &&
          results[el.type].push({
            name: el.body,
            data: el.body,
          });
      });
    return results;
  });

  async function update(token: string) {
    if (!issueStore.issueId) {
      throw new Error('no issue id');
    }

    const { data } = await fetchResources<PoemsTemplate>(
      token,
      '/api/poemsTemplates',
      {
        query: { issueId: issueStore.issueId, searchQuery: searchQuery.value },
      }
    );

    poemsTemplates.value = data;
  }

  async function init(token: string) {
    await update(token);
  }

  function resetForm() {
    state.value = activePoemsTemplate.value ? 'DETAILS' : 'NEW';
    currentPoemsTemplate.value = activePoemsTemplate.value
      ? cloneDeep(activePoemsTemplate.value)
      : getNewPoemsTemplate();
  }

  watch(activePoemsTemplate, () => {
    resetForm();
  });

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
    searchQuery,
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

    init,
    update,
    resetForm,
    getRandomContext,
    randomizeContext,
  };
});
