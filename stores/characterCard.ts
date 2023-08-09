import { Character, NewCharacter } from '@/types/character';
import { CardState, CardStates } from '@/types/cardState';

const newCharacter = {
  role: '',
  name: '',
  trait: '',
  other: '',
} as NewCharacter;

export const useCharacterCardStore = definePiniaStore('character card', () => {
  // current session usage
  const activeCharacter = ref<Character | null>(null);
  const currentCharacter = ref<Character | NewCharacter>(newCharacter);
  const state = ref<CardState>(CardStates.New);

  function clearCurrentCharacter() {
    currentCharacter.value = { ...newCharacter, creatorId: "HEHE's id" };
  }

  function clearActiveCharacter() {
    activeCharacter.value = null;
  }

  function setCurrentCharacter(w: Character) {
    currentCharacter.value = { ...w };
  }

  function setActiveCharacter(w: Character) {
    activeCharacter.value = { ...w };
  }

  watch(state, (newState, oldState) => {
    if (newState.name === CardStates.New.name) {
      clearActiveCharacter();
      clearCurrentCharacter();
    }
  });

  return {
    activeCharacter,
    currentCharacter,
    state,

    clearActiveCharacter,
    clearCurrentCharacter,
    setActiveCharacter,
    setCurrentCharacter,
  };
});
