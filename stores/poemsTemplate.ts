import { FormStateKeys, PoemsTemplate, NewPoemsTemplate } from '@/types';
import { getNewPoemsTemplate } from '@/utils';

export const usePoemsTemplateStore = definePiniaStore('poems template', () => {
  const issueStore = useIssueStore();

  const poemsTemplates = computed((): PoemsTemplate[] =>
    issueStore.issue ? issueStore.issue.poemsTemplates : []
  );

  const currentPoemsTemplate = ref<PoemsTemplate | NewPoemsTemplate>(
    getNewPoemsTemplate()
  );
  const activePoemsTemplate = ref<PoemsTemplate | null>(null);
  const activeId = computed(() => activePoemsTemplate.value?._id);

  const state = ref<FormStateKeys>('NEW');
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

  return {
    poemsTemplates,
    currentPoemsTemplate,
    activePoemsTemplate,
    activeId,

    state,
    loading,
    formDisabled,
    formCardProps,

    upsertPoemsTemplate,
    removePoemsTemplate,
    clearCurrentPoemsTemplate,
    changeActivePoemsTemplate,
  };
});
