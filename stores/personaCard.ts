import { Persona, NewPersona } from '../types/persona';
import { CardState, CardStates } from '@/types/cardState';
import { fakerZH_TW } from '@faker-js/faker';

const getNewPersona = (): NewPersona => ({
  role: '',
  name: '',
  age: '',
  trait: '',
  gender: fakerZH_TW.helpers.arrayElement(['male', 'female']),
  other: '',
});

export const usePersonaCardStore = definePiniaStore('persona card', () => {
  // current session usage
  const currentPersona = ref<Persona | NewPersona>(getNewPersona());
  const activeId = ref<string | null>(null);
  const state = ref<CardState>(CardStates.New);

  function clearCurrentPersona() {
    currentPersona.value = getNewPersona();
  }

  function clearActiveId() {
    activeId.value = null;
  }

  function setCurrentPersona(w: Persona) {
    currentPersona.value = { ...w };
  }

  function setActiveId(id: string) {
    activeId.value = id;
  }

  watch(state, (newState, oldState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveId();
      clearCurrentPersona();
    }
  });

  return {
    activeId,
    currentPersona,
    state,

    clearActiveId,
    clearCurrentPersona,
    setActiveId,
    setCurrentPersona,
  };
});
