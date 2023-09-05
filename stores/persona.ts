import { getNewPersona } from '~/utils';
import {
  FormStateKeys,
  Persona,
  NewPersona,
  PortraitRequestBody,
  NewPersonaSchema,
  PersonaContext,
} from '@/types';

export const usePersonaStore = definePiniaStore('persona', () => {
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
    currentPersona,
    activePersona,
    activeId,

    imageUrlBuffer,
    imageFileBuffer,

    state,
    loading,
    formDisabled,
    formCardProps,

    clearCurrentPersona,
    changeActivePersona,
  };
});
