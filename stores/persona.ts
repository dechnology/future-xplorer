import cloneDeep from 'lodash/cloneDeep';

import { getNewPersona } from '~/utils';
import { FormStateKey, Persona, NewPersona, ImageStateKey } from '@/types';

export const usePersonaStore = definePiniaStore('persona', () => {
  const issueStore = useIssueStore();

  const searchQuery = ref<string>();
  const personas = ref<Persona[]>([]);

  const currentPersona = ref<Persona | NewPersona>(getNewPersona());
  const activePersona = ref<Persona | null>(null);
  const activeId = computed(() => activePersona.value?._id);

  const imageUrl = ref<string | null>(null);
  const imageFile = ref<File | null>(null);

  const state = ref<FormStateKey>('NEW');
  const imageState = ref<ImageStateKey>('IDLE');
  const loading = ref(false);
  const formDisabled = computed(
    () =>
      state.value === 'DETAILS' || imageState.value !== 'IDLE' || loading.value
  );
  const formCardProps = computed(() =>
    getCurrentFormCardProps(
      '人物',
      currentPersona.value as Persona,
      state.value
    )
  );

  async function update(token: string) {
    if (!issueStore.issueId) {
      throw new Error('no issue id');
    }

    const { data } = await fetchResources<Persona>(token, '/api/personas', {
      query: { issueId: issueStore.issueId, searchQuery: searchQuery.value },
    });

    personas.value = data;
  }

  async function init(token: string) {
    await update(token);
  }

  function resetForm() {
    state.value = activePersona.value ? 'DETAILS' : 'NEW';
    currentPersona.value = activePersona.value
      ? cloneDeep(activePersona.value)
      : getNewPersona();
  }

  function resetImage() {
    imageState.value =
      !activePersona.value || activePersona.value.image ? 'IDLE' : 'NONE';
    imageFile.value = null;
    imageUrl.value = null;
  }

  watch(activePersona, () => {
    resetForm();
    resetImage();
  });

  return {
    searchQuery,
    personas,
    currentPersona,
    activePersona,
    activeId,

    imageUrl,
    imageFile,

    state,
    imageState,
    loading,
    formDisabled,
    formCardProps,

    update,
    init,
    resetForm,
    resetImage,
  };
});
