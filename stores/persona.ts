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
  const imgStatus = ref<
    | 'waitting'
    | 'prompt'
    | 'avatar'
    | 'uploading'
    | 'finished'
    | 'promptError'
    | 'avatarError'
    | 'uploadingError'
  >('waitting');

  const state = ref<FormStateKeys>('NEW');
  const loading = ref(false);
  const formDisabled = computed(
    () => state.value === 'DETAILS' || loading.value
  );
  const aiDisabled = computed(() => {
    const arr = Object.entries(currentPersona.value).map(([key, value]) => {
      return { key, value };
    });
    console.log('arr =>', arr);
    const optionalProps = [
      'other',
      'image',
      '_id',
      'creator',
      'issue',
      'createdAt',
      'updatedAt',
      '__v',
      'id',
    ];
    const requiredProps = arr.filter(
      (item) => !optionalProps.includes(item.key)
    );
    // check if all required props are filled
    const isFilled = requiredProps.every((item) => !!item.value);
    const result = !isFilled || loading.value;
    return result;
  });
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
    imageFileBuffer.value = null;
    imageUrlBuffer.value = null;
    imgStatus.value = 'waitting';
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

  function aiPromptGeneration() {
    console.log('imgStatus.value =>', imgStatus.value);
    imgStatus.value = 'prompt';
    console.log('imgStatus.value =>', imgStatus.value);
  }
  function aiPromptFailed() {
    console.log('imgStatus.value =>', imgStatus.value);
    imgStatus.value = 'promptError';
    console.log('imgStatus.value =>', imgStatus.value);
  }
  function aiAvatarGeneration() {
    console.log('imgStatus.value =>', imgStatus.value);
    imgStatus.value = 'avatar';
    console.log('imgStatus.value =>', imgStatus.value);
  }
  function aiAvatarFailed() {
    console.log('imgStatus.value =>', imgStatus.value);
    imgStatus.value = 'avatarError';
    console.log('imgStatus.value =>', imgStatus.value);
  }
  function aiUploading() {
    console.log('imgStatus.value =>', imgStatus.value);
    imgStatus.value = 'uploading';
    console.log('imgStatus.value =>', imgStatus.value);
  }
  function aiUploadingFailed() {
    console.log('imgStatus.value =>', imgStatus.value);
    imgStatus.value = 'uploadingError';
    console.log('imgStatus.value =>', imgStatus.value);
  }
  function aiFinishedGeneration() {
    console.log('imgStatus.value =>', imgStatus.value);
    imgStatus.value = 'finished';
    console.log('imgStatus.value =>', imgStatus.value);
  }

  return {
    personas,
    currentPersona,
    activePersona,
    activeId,

    imageUrlBuffer,
    imageFileBuffer,
    imgStatus,

    state,
    loading,
    formDisabled,
    aiDisabled,
    formCardProps,

    upsertPersona,
    removePersona,
    clearCurrentPersona,
    changeActivePersona,
    aiPromptGeneration,
    aiPromptFailed,
    aiAvatarGeneration,
    aiAvatarFailed,
    aiUploading,
    aiUploadingFailed,
    aiFinishedGeneration,
  };
});
