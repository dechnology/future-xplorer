import { getNewPersona } from '~/utils';
import { FormStateKeys, Persona, NewPersona } from '@/types';

export const usePersonaStore = definePiniaStore('persona', () => {
  const issueStore = useIssueStore();

  const personas = computed((): Persona[] =>
    issueStore.issue ? issueStore.issue.personas : []
  );

  const currentPersona = ref<Persona | NewPersona>(getNewPersona());
  const activePersona = ref<Persona | null>(null);
  const activeId = computed(() => activePersona.value?._id);
  const imageUrlBuffer = ref<string | null>(null);
  const imageFileBuffer = ref<File | null>(null);

  const state = ref<FormStateKeys>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps(
      '人物',
      currentPersona.value as Persona,
      state.value
    )
  );

  function upsertPersona(el: Persona) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.personas.findIndex(
      (persona) => persona._id === el._id
    );

    if (index === -1) {
      issueStore.issue.personas.push(el);
    } else {
      issueStore.issue.personas[index] = el;
    }
  }

  function removePersona(id: string) {
    if (!issueStore.issue) {
      return;
    }

    const index = issueStore.issue?.personas.findIndex(
      (persona) => persona._id === id
    );

    if (index === -1) {
      throw new Error('no issue match given id');
    } else {
      issueStore.issue.personas.splice(index, 1);
    }
  }

  function clearCurrentPersona() {
    currentPersona.value = getNewPersona();
  }

  function changeActivePersona(p?: Persona | null) {
    if (p) {
      activePersona.value = { ...p };
      currentPersona.value = { ...p };
      state.value = 'DETAILS';
    } else {
      activePersona.value = null;
      clearCurrentPersona();
      state.value = 'NEW';
    }
    imageFileBuffer.value = null;
    imageUrlBuffer.value = null;
  }

  return {
    personas,
    currentPersona,
    activePersona,
    activeId,

    imageUrlBuffer,
    imageFileBuffer,

    state,
    loading,
    formDisabled,
    formCardProps,

    upsertPersona,
    removePersona,
    clearCurrentPersona,
    changeActivePersona,
  };
});
